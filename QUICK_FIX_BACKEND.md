# QUICK FIX: 403 Error - Backend Security Configuration

## The Issue
Your backend is returning **403 Forbidden** with an **empty response body**, which indicates the request is being blocked **before** reaching your controller. This is typically caused by:

1. **Spring Security configuration blocking the endpoint**
2. **CORS configuration issue**
3. **Missing authentication filter for this specific endpoint**

## Immediate Backend Fix Required

### Step 1: Check Your Security Configuration

Find your `SecurityConfig.java` or `WebSecurityConfig.java` file and ensure the `/groups/join-by-code` endpoint is permitted:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/groups/join-by-code").authenticated()  // ← ADD THIS
                .requestMatchers("/groups/**").authenticated()
                .anyRequest().authenticated()
            )
            // ... rest of config
        return http.build();
    }
}
```

### Step 2: Update GroupController (Replace @AuthenticationPrincipal)

The `/groups/join-by-code` endpoint **MUST** use the same authentication pattern as your other endpoints:

```java
@PostMapping("/join-by-code")
public ResponseEntity<?> joinByCode(
        @RequestBody Map<String, String> request,
        @RequestHeader("Authorization") String authHeader) {
    try {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = authService.getEmailFromToken(token);
            
            String inviteCode = request.get("inviteCode");
            
            // Validate invite code is provided
            if (inviteCode == null || inviteCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Invite code is required");
            }
            
            GroupResponse group = groupService.joinGroupByCode(inviteCode.trim(), email);
            return ResponseEntity.ok(group);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Missing or invalid authorization header");
    } catch (RuntimeException e) {
        e.printStackTrace(); // Add logging
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

### Step 3: Do the Same for Other Invite Code Endpoints

```java
// Get invite code
@GetMapping("/{groupId}/invite-code")
public ResponseEntity<?> getInviteCode(
        @PathVariable Long groupId,
        @RequestHeader("Authorization") String authHeader) {
    try {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = authService.getEmailFromToken(token);
            
            String inviteCode = groupService.getGroupInviteCode(groupId, email);
            return ResponseEntity.ok(Map.of(
                    "inviteCode", inviteCode,
                    "groupId", groupId.toString()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Missing or invalid authorization header");
    } catch (RuntimeException e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

// Regenerate invite code
@PostMapping("/{groupId}/regenerate-invite-code")
public ResponseEntity<?> regenerateInviteCode(
        @PathVariable Long groupId,
        @RequestHeader("Authorization") String authHeader) {
    try {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = authService.getEmailFromToken(token);
            
            String newCode = groupService.regenerateInviteCode(groupId, email);
            return ResponseEntity.ok(Map.of(
                    "inviteCode", newCode,
                    "message", "Invite code regenerated successfully"
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Missing or invalid authorization header");
    } catch (RuntimeException e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

### Step 4: Verify CORS Configuration

Make sure your CORS configuration allows the Authorization header:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000", "http://localhost:3001")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true);
            }
        };
    }
}
```

## Why This is Happening

Looking at your backend controller, you have:

```java
// ❌ This uses @AuthenticationPrincipal (won't work with your JWT setup)
@PostMapping("/join-by-code")
public ResponseEntity<GroupResponse> joinByCode(
        @RequestBody Map<String, String> request,
        @AuthenticationPrincipal UserDetails userDetails) {
    String inviteCode = request.get("inviteCode");
    GroupResponse group = groupService.joinGroupByCode(inviteCode, userDetails.getUsername());
    return ResponseEntity.ok(group);
}
```

But your other endpoints use:

```java
// ✅ This works with your JWT setup
@PostMapping
public ResponseEntity<?> createGroup(
        @Valid @RequestBody CreateGroupRequest request,
        @RequestHeader("Authorization") String authHeader) {
    // ... works fine
}
```

**The problem:** `@AuthenticationPrincipal` expects Spring Security's `SecurityContext` to be populated with a `UserDetails` object, but your JWT filter doesn't do this. It only validates the token and extracts the email.

## Quick Test After Changes

1. **Restart your backend server** (important!)
2. In browser console on the Groups page, run:

```javascript
// Test the endpoint directly
fetch('http://localhost:8080/groups/join-by-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  body: JSON.stringify({ inviteCode: 'GRP0000004' })
})
.then(r => r.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

## Expected Outcome After Fix

**Before:** `403 Forbidden` with empty response  
**After:** 
- Success: `200 OK` with group details
- Invalid code: `400 Bad Request` with error message
- Already member: `400 Bad Request` with "already a member" message

## Checklist

- [ ] Update `GroupController.java` - replace @AuthenticationPrincipal with @RequestHeader
- [ ] Check `SecurityConfig.java` - ensure `/groups/join-by-code` is authenticated (not permitAll, not blocked)
- [ ] Check CORS config - ensure Authorization header is allowed
- [ ] Restart backend server
- [ ] Test with browser console command above
- [ ] Test with UI

## If Still Not Working

Check your backend console for errors. You should see:
- The request arriving
- Token being validated
- Email being extracted
- Service method being called

If you see NONE of this, the request is being blocked by a filter before reaching your controller.

## Common Culprits

1. **JWT Filter not configured for this endpoint**
2. **Spring Security blocking with default security**
3. **CORS preflight failing**
4. **Different authentication required (like Basic Auth)**

Add this to your backend to debug:

```java
@Component
public class RequestLoggingFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        System.out.println("🔍 Request: " + req.getMethod() + " " + req.getRequestURI());
        System.out.println("🔍 Authorization: " + req.getHeader("Authorization"));
        chain.doFilter(request, response);
    }
}
```

This will show you if the request even reaches your backend with the Authorization header.
