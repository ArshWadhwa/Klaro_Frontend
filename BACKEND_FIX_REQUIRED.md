# 🔴 BACKEND BUG - URGENT FIX REQUIRED

## Problem
The `GET /groups/{groupId}` endpoint is returning an **empty members array** even though members exist in the database.

## Evidence
```
✅ POST /groups returns: { members: [9 members], memberCount: 9 }
❌ GET /groups/{id} returns: { members: [], memberCount: 0 }
```

## Root Cause
The backend's `getGroupById` method is likely:
1. Not fetching the group-member relationships from the database
2. Not joining the User table with the GroupMember table
3. Not properly mapping members to the response DTO

## Fix Required in Spring Boot Backend

### File: `GroupController.java` or `GroupService.java`

**Current (broken) code probably looks like:**
```java
@GetMapping("/{groupId}")
public ResponseEntity<GroupDetailsDTO> getGroupById(@PathVariable Long groupId) {
    Group group = groupRepository.findById(groupId)
        .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
    
    // BUG: Not fetching members here!
    GroupDetailsDTO dto = new GroupDetailsDTO();
    dto.setId(group.getId());
    dto.setName(group.getName());
    // ... other fields
    dto.setMembers(new ArrayList<>()); // This is wrong!
    
    return ResponseEntity.ok(dto);
}
```

**Fixed code should be:**
```java
@GetMapping("/{groupId}")
public ResponseEntity<GroupDetailsDTO> getGroupById(@PathVariable Long groupId) {
    Group group = groupRepository.findById(groupId)
        .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
    
    // FIX: Fetch group members from database
    List<GroupMember> groupMembers = groupMemberRepository.findByGroupId(groupId);
    
    // Map members to DTOs
    List<MemberInfoDTO> members = groupMembers.stream()
        .map(gm -> {
            User user = gm.getUser();
            return new MemberInfoDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                group.getOwner().getId().equals(user.getId())
            );
        })
        .collect(Collectors.toList());
    
    GroupDetailsDTO dto = new GroupDetailsDTO();
    dto.setId(group.getId());
    dto.setName(group.getName());
    dto.setDescription(group.getDescription());
    dto.setOwnerName(group.getOwner().getFullName());
    dto.setOwnerEmail(group.getOwner().getEmail());
    dto.setMembers(members); // Properly set members
    dto.setMemberCount(members.size());
    dto.setProjectCount(projectRepository.countByGroupId(groupId));
    dto.setCreatedAt(group.getCreatedAt());
    dto.setUpdatedAt(group.getUpdatedAt());
    
    return ResponseEntity.ok(dto);
}
```

### Alternative: Use JPA Fetch Join

If using JPA, you can also fix it with a fetch join in your repository:

```java
@Query("SELECT g FROM Group g LEFT JOIN FETCH g.members WHERE g.id = :groupId")
Optional<Group> findByIdWithMembers(@PathVariable Long groupId);
```

## How to Verify Fix

1. Create a group with members via `POST /groups`
2. Note the returned `memberCount` (e.g., 9)
3. Call `GET /groups/{id}` for that group
4. Verify response contains:
   ```json
   {
     "members": [
       {
         "id": 1,
         "fullName": "User Name",
         "email": "user@example.com",
         "owner": true
       }
       // ... more members
     ],
     "memberCount": 9
   }
   ```

## Priority
🔴 **CRITICAL** - This breaks the entire group membership feature. Users cannot see who is in their groups.

## Affected Features
- Group detail page (shows "No members yet")
- Member management
- Group collaboration visibility
- User experience severely impacted

---

**Frontend Status:** ✅ Working correctly (sending & receiving data properly)  
**Backend Status:** ❌ Bug in GET endpoint - not returning members
