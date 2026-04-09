# Backend Authentication Issue - URGENT FIX REQUIRED

## Problem
The invite code endpoints in the backend use a different authentication mechanism than other endpoints, causing 403 errors.

## Root Cause
**Inconsistent Authentication in Backend Controller:**

### ❌ Problematic Endpoints (using @AuthenticationPrincipal):
```java
// These endpoints use Spring Security's @AuthenticationPrincipal
@GetMapping("/{groupId}/invite-code")
public ResponseEntity<Map<String, String>> getInviteCode(
        @PathVariable Long groupId,
        @AuthenticationPrincipal UserDetails userDetails)

@PostMapping("/{groupId}/regenerate-invite-code")
public ResponseEntity<Map<String, String>> regenerateInviteCode(
        @PathVariable Long groupId,
        @AuthenticationPrincipal UserDetails userDetails)

@PostMapping("/join-by-code")
public ResponseEntity<GroupResponse> joinByCode(
        @RequestBody Map<String, String> request,
        @AuthenticationPrincipal UserDetails userDetails)
```

### ✅ Working Endpoints (using @RequestHeader):
```java
// These endpoints use JWT from Authorization header
@PostMapping
public ResponseEntity<?> createGroup(
        @Valid @RequestBody CreateGroupRequest request,
        @RequestHeader("Authorization") String authHeader)

@GetMapping
public ResponseEntity<?> getUserGroups(
        @RequestHeader("Authorization") String authHeader)
```

## Backend Fix Required

**File:** `src/main/java/org/example/controller/GroupController.java`

Replace the three problematic endpoints with this code:

```java
// Get invite code for a group
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
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

// Join group by code
@PostMapping("/join-by-code")
public ResponseEntity<?> joinByCode(
        @RequestBody Map<String, String> request,
        @RequestHeader("Authorization") String authHeader) {
    try {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = authService.getEmailFromToken(token);
            
            String inviteCode = request.get("inviteCode");
            GroupResponse group = groupService.joinGroupByCode(inviteCode, email);
            return ResponseEntity.ok(group);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Missing or invalid authorization header");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

## Why This Happens

Spring Security's `@AuthenticationPrincipal` requires:
1. A properly configured `SecurityContextHolder`
2. An authentication filter that populates the security context
3. The authentication object to contain a `UserDetails` principal

Your current JWT authentication setup uses custom header extraction (`@RequestHeader("Authorization")`) and doesn't populate Spring Security's `SecurityContext`, which is why `@AuthenticationPrincipal` returns null and causes 403 errors.

## Steps to Fix

1. Open `GroupController.java` in your backend
2. Find the three endpoints mentioned above
3. Replace them with the provided code
4. Restart your backend server
5. Test the invite code functionality

## Testing After Fix

1. **Get Invite Code:**
   - Login as admin
   - Create or open a group
   - Verify invite code is displayed

2. **Join by Code:**
   - Login as regular user
   - Click "Join Group"
   - Enter valid invite code
   - Should successfully join

3. **Regenerate Code:**
   - Login as admin/owner
   - Click regenerate button
   - Verify new code is different
   - Old code should no longer work

## Alternative Solution (if you want to keep @AuthenticationPrincipal)

If you prefer to use `@AuthenticationPrincipal`, you need to configure Spring Security to populate the context from JWT:

1. Create a JWT Authentication Filter that sets the SecurityContext
2. Configure Spring Security filter chain
3. This is more complex but follows Spring Security best practices

Let me know which approach you prefer!
