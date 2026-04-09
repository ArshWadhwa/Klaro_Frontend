# Troubleshooting Guide: 403 Error on Join Group

## Quick Diagnosis

Run this in your browser console while on the Groups page:

```javascript
// Check if token exists
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));

// Check token structure
const token = localStorage.getItem('accessToken');
if (token) {
  const parts = token.split('.');
  console.log('Token parts:', parts.length); // Should be 3
  if (parts.length === 3) {
    const payload = JSON.parse(atob(parts[1]));
    console.log('Token payload:', payload);
  }
}
```

## Expected vs Actual Behavior

### Expected:
1. User enters invite code
2. Frontend sends POST to `/groups/join-by-code` with:
   - Header: `Authorization: Bearer <token>`
   - Body: `{ "inviteCode": "ABC123XYZ" }`
3. Backend validates token, extracts user email
4. Backend adds user to group
5. Returns group details

### Actual:
1. ✅ User enters invite code
2. ✅ Frontend sends request correctly
3. ❌ Backend returns 403 (Forbidden)
4. ❌ User not added to group

## Root Cause

**The backend endpoint uses `@AuthenticationPrincipal UserDetails userDetails` which requires Spring Security's SecurityContext to be populated. However, your JWT authentication doesn't populate this context.**

## The Fix (Backend Required)

### Option 1: Quick Fix - Match Other Endpoints ⭐ RECOMMENDED

Change the three endpoints to use the same pattern as your other endpoints:

**Before:**
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

**After:**
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

### Option 2: Configure Spring Security (More Complex)

If you want to keep using `@AuthenticationPrincipal`, you need to:

1. Create a JWT Authentication Filter
2. Set up SecurityContext
3. Configure Spring Security filter chain

This is the "proper" way but requires more changes.

## How to Verify the Fix

### 1. Check Backend Logs
After applying the fix, you should see:
```
✅ Fetched [X] member emails for group [Y]
✅ [User email] successfully joined group [Group name]
```

### 2. Test Frontend
1. Login as a user
2. Get an invite code from a group (as admin)
3. Click "Join Group"
4. Enter the code
5. Should see: "Successfully joined [Group Name]!"

### 3. Verify in Database
```sql
-- Check if user was added to group
SELECT gm.*, u.email, g.name 
FROM group_members gm
JOIN users u ON gm.user_id = u.id
JOIN groups g ON gm.group_id = g.id
WHERE u.email = 'your-email@example.com';
```

## Common Issues After Fix

### Still Getting 403?
- Clear browser cache
- Logout and login again
- Check token expiry: `console.log(new Date(payload.exp * 1000))`

### Getting 404 (Invalid Code)?
- Code is case-sensitive
- Code might have been regenerated
- Check: `SELECT id, name, invite_code FROM groups WHERE invite_code = 'YOUR_CODE';`

### Getting "Already a member"?
- User is already in the group
- Check: `SELECT * FROM group_members WHERE user_id = X AND group_id = Y;`

## Testing Checklist

After backend fix, test these scenarios:

- [ ] Admin can view invite code
- [ ] Admin can copy invite code
- [ ] Admin can regenerate invite code
- [ ] User can join with valid code
- [ ] User gets error with invalid code
- [ ] User gets error when already a member
- [ ] User sees group in their list after joining
- [ ] New member appears in group members list

## Need Help?

If the fix doesn't work:

1. Share backend console logs
2. Share browser console logs  
3. Share network tab screenshot showing the request/response
4. Check if other authenticated endpoints work (like creating projects)

## Summary

**The frontend code is correct.** The issue is in the backend controller using incompatible authentication annotations. Apply the fix above and the invite code feature will work perfectly!
