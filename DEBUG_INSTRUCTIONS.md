# 🔍 Debug Instructions

## Check if Token is Being Sent

Open your browser console and run:

```javascript
// Check if token exists
const token = localStorage.getItem('accessToken');
console.log('Token exists:', !!token);
console.log('Token:', token);

// Test the groups endpoint directly
fetch('http://localhost:8080/groups', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Headers sent:', r.headers);
  return r.text();
})
.then(data => {
  console.log('Response:', data);
})
.catch(err => console.error('Error:', err));
```

---

## What to Look For

1. **If token is null/undefined:**
   - You need to login again
   - The token wasn't saved properly

2. **If you get 403 even with direct fetch:**
   - Backend issue - Spring Security is blocking the request
   - Check backend SecurityConfig

3. **If direct fetch works but app fails:**
   - Frontend axios client issue
   - Check client.ts interceptor

---

## Run This Test
