# 🔴 CRITICAL: Backend Entity Circular Reference Fix

## Problem Diagnosis

Your backend is crashing with `StackOverflowError` due to **circular references** in JPA entities.

### Stack Trace Pattern:
```
User.hashCode() → groups.hashCode() 
  → Group.hashCode() → members.hashCode() 
    → User.hashCode() → groups.hashCode() 
      → INFINITE LOOP ♾️ → StackOverflowError 💥
```

---

## 🛠️ REQUIRED FIXES (Apply ALL 3)

### Fix 1: Override `hashCode()` and `equals()` in User Entity

**File:** `src/main/java/org/example/entity/User.java`

**FIND the @Data annotation at the top of the class:**
```java
@Data
@Entity
@Table(name = "users")
public class User {
    // fields...
}
```

**REPLACE `@Data` WITH:**
```java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    // ...existing fields...
    
    @ManyToMany(mappedBy = "members", fetch = FetchType.LAZY)
    private Set<Group> groups = new HashSet<>();
    
    // ADD THESE METHODS AT THE END OF THE CLASS:
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
```

---

### Fix 2: Override `hashCode()` and `equals()` in Group Entity

**File:** `src/main/java/org/example/entity/Group.java`

**FIND the @Data annotation:**
```java
@Data
@Entity
@Table(name = "groups")
public class Group {
    // fields...
}
```

**REPLACE `@Data` WITH:**
```java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "groups")
public class Group {
    // ...existing fields...
    
    @ManyToMany
    @JoinTable(
        name = "group_members",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();
    
    // ADD THESE METHODS AT THE END OF THE CLASS:
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Group)) return false;
        Group group = (Group) o;
        return id != null && id.equals(group.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
```

---

### Fix 3: Add @JsonIgnoreProperties to Prevent JSON Serialization Loops

**In User.java, update the groups field:**
```java
@ManyToMany(mappedBy = "members", fetch = FetchType.LAZY)
@JsonIgnoreProperties("members")  // ← ADD THIS
private Set<Group> groups = new HashSet<>();
```

**In Group.java, update the members field:**
```java
@ManyToMany
@JoinTable(
    name = "group_members",
    joinColumns = @JoinColumn(name = "group_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id")
)
@JsonIgnoreProperties("groups")  // ← ADD THIS
private Set<User> members = new HashSet<>();
```

---

## 📦 Required Imports

**Add to User.java:**
```java
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
```

**Add to Group.java:**
```java
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
```

---

## ⚙️ After Applying Fixes

1. **Rebuild the project:**
   ```bash
   mvn clean install
   # OR
   ./gradlew clean build
   ```

2. **Restart the backend:**
   ```bash
   mvn spring-boot:run
   # OR
   ./gradlew bootRun
   ```

3. **Verify startup - you should see:**
   ```
   ✅ Started Application in X.XXX seconds
   ✅ Tomcat started on port(s): 8080
   ```

4. **Test the groups endpoint:**
   - Open browser console on http://localhost:3001
   - Run:
     ```javascript
     const token = localStorage.getItem('accessToken');
     fetch('http://localhost:8080/groups', {
       headers: { 'Authorization': `Bearer ${token}` }
     }).then(r => r.json()).then(console.log);
     ```
   - **Expected:** List of groups without errors ✅

---

## 🔍 Why This Happens

### The Problem with @Data

Lombok's `@Data` annotation generates:
- `hashCode()` that includes **all fields** (including collections)
- `equals()` that includes **all fields** (including collections)

### When Hibernate Fetches Entities:

```
1. Fetch User → User.hashCode() called
2. hashCode() accesses groups field
3. Hibernate loads groups collection
4. Groups collection calls Group.hashCode()
5. Group.hashCode() accesses members field
6. Hibernate loads members collection
7. Members collection calls User.hashCode()
8. BACK TO STEP 2 → INFINITE LOOP 💥
```

### The Solution

Use **ID-based equality**:
- `equals()` compares only the `id` field
- `hashCode()` returns constant value (doesn't access collections)
- Collections can still be lazy-loaded without triggering recursion

---

## ✅ Verification Checklist

After restart, confirm:

- [ ] Backend starts without StackOverflowError
- [ ] `GET /groups` returns 200 OK
- [ ] `GET /groups/{id}` returns group details
- [ ] Frontend dashboard loads without 403 errors
- [ ] No circular reference errors in logs
- [ ] Group members are populated correctly

---

## 🎯 Summary

| Issue | Root Cause | Fix |
|-------|------------|-----|
| StackOverflowError | @Data generates hashCode() using collections | Replace @Data with @Getter/@Setter + custom hashCode()/equals() |
| Infinite loop | User.groups ↔ Group.members recursion | ID-based equality (don't access collections in hashCode) |
| JSON serialization | Bidirectional relationship | @JsonIgnoreProperties on both sides |

---

## 📞 If Issues Persist

1. **Check Lombok version** (should be 1.18.20+):
   ```xml
   <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
       <version>1.18.30</version>
   </dependency>
   ```

2. **Clean build directory:**
   ```bash
   mvn clean
   rm -rf target/
   mvn install
   ```

3. **Verify other entities** - Apply same fix to any entity with @ManyToMany or @OneToMany relationships

---

**This fix will resolve ALL entity-related StackOverflow errors and allow your dashboard to load properly! 🎉**
