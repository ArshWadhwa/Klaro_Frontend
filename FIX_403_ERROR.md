# 403 ERROR RESOLUTION GUIDE

## Current Situation

You're getting a **403 Forbidden** error when trying to join a group using an invite code. The frontend is correctly sending the request with the JWT token, but the backend is rejecting it.

## Root Cause

Your backend uses **two different authentication patterns**:

### ✅ Working Endpoints (95% of your API)
```java
@PostMapping
public ResponseEntity<?> createGroup(
        @RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    String email = authService.getEmailFromToken(token);
    // ... works fine
}
```

### ❌ Broken Endpoints (invite code endpoints only)
```java
@PostMapping("/join-by-code")
public ResponseEntity<GroupResponse> joinByCode(
        @AuthenticationPrincipal UserDetails userDetails) {
    // userDetails is NULL because SecurityContext is not populated
    // This causes 403 error
}
```

## The Fix (Backend Only - 5 minutes)

### Step 1: Open `GroupController.java`

Find these three methods:
1. `getInviteCode`
2. `regenerateInviteCode`  
3. `joinByCode`

### Step 2: Replace Them

**REPLACE:**
```java
@PostMapping("/join-by-code")
public ResponseEntity<GroupResponse> joinByCode(
        @RequestBody Map<String, String> request,
        @AuthenticationPrincipal UserDetails userDetails) {
    String inviteCode = request.get("inviteCode");
    GroupResponse group = groupService.joinGroupByCode(inviteCode, userDetails.getUsername());
    return ResponseEntity.ok(group);
}
```

**WITH:**
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
            if (inviteCode == null || inviteCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Invite code is required");
            }
            
            GroupResponse group = groupService.joinGroupByCode(inviteCode.trim(), email);
            return ResponseEntity.ok(group);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Missing or invalid authorization header");
    } catch (RuntimeException e) {
        System.err.println("Error in joinByCode: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

Do the same for:

```java
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
        System.err.println("Error in getInviteCode: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

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
        System.err.println("Error in regenerateInviteCode: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

### Step 3: Restart Backend

```bash
# Stop your backend
# Then start it again
mvn spring-boot:run
# or however you run your backend
```

### Step 4: Test

1. **In your browser console** (when on Groups page), paste and run the code from `test-invite-code.js`
2. Or just try the "Join Group" button again with invite code `GRP0000004`

## Debugging (If Still Not Working)

### Test Script

Copy this into your browser console when on the Groups page:

```javascript
// Quick test
const token = localStorage.getItem('accessToken');
console.log('Token exists:', !!token);

fetch('http://localhost:8080/groups/join-by-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ inviteCode: 'GRP0000004' })
})
.then(r => {
  console.log('Status:', r.status);
  return r.text();
})
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

### Expected Results

**Before Fix:**
```
Status: 403
Response: (empty or generic error)
```

**After Fix:**
```
Status: 200
Response: { "id": 4, "name": "Test Group", ... }
```

OR if already a member:
```
Status: 400
Response: "You are already a member of this group"
```

OR if invalid code:
```
Status: 400
Response: "Invalid invite code"
```

## Why @AuthenticationPrincipal Doesn't Work

Your JWT setup:
1. ✅ Validates JWT token in request header
2. ✅ Extracts email from token
3. ❌ **Does NOT populate Spring Security's SecurityContext**
4. ❌ **Does NOT create UserDetails object**

So when Spring sees `@AuthenticationPrincipal UserDetails userDetails`:
- It looks in SecurityContext
- Finds nothing
- Returns 403 Forbidden

## Complete Checklist

- [ ] Update `joinByCode` method in GroupController
- [ ] Update `getInviteCode` method in GroupController
- [ ] Update `regenerateInviteCode` method in GroupController
- [ ] Restart backend server
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Test with browser console script
- [ ] Test with UI "Join Group" button

## Files to Check

**Backend:**
- `src/main/java/org/example/controller/GroupController.java` - Make changes here
- `src/main/java/org/example/service/GroupService.java` - Should work as-is
- Backend console logs - Check for errors

**Frontend:** (Already correct, no changes needed)
- `src/lib/api/groups.api.ts` ✅
- `src/components/groups/JoinGroupDialog.tsx` ✅
- `src/app/(dashboard)/groups/page.tsx` ✅

## Common Issues

### "Still getting 403 after changes"
- Did you restart the backend?
- Did you save the file?
- Are you editing the right file?
- Check backend console for compilation errors

### "Getting 400 Bad Request now"
- Good! This means authentication works
- Check the error message
- Could be "Invalid invite code" or "Already a member"

### "Getting 401 Unauthorized"
- Token expired
- Logout and login again
- Check: `localStorage.getItem('accessToken')`

## Success Indicators

✅ You'll know it works when:
1. No 403 errors in console
2. Toast shows "Successfully joined [Group Name]!"
3. Group appears in your groups list
4. You can see yourself in the group members

## Need More Help?

If still not working after the fix:

1. Check backend console output
2. Run the test script and share results
3. Share the exact error message from backend logs
4. Verify the `authService.getEmailFromToken()` method works

The fix is simple - just matching the authentication pattern used everywhere else in your codebase! 🎯
