// // Test Component - Add this temporarily to your Groups page to debug
// // Copy and paste into browser console when on the Groups page

// async function testInviteCodeEndpoint() {
//   console.log('=== TESTING INVITE CODE ENDPOINT ===\n');
  
//   // 1. Check tokens
//   const accessToken = localStorage.getItem('accessToken');
//   const refreshToken = localStorage.getItem('refreshToken');
  
//   console.log('1️⃣ TOKEN CHECK:');
//   console.log('   Access token exists:', !!accessToken);
//   console.log('   Refresh token exists:', !!refreshToken);
  
//   if (!accessToken) {
//     console.error('❌ No access token found! Please login first.');
//     return;
//   }
  
//   // 2. Parse token
//   console.log('\n2️⃣ TOKEN DETAILS:');
//   try {
//     const parts = accessToken.split('.');
//     console.log('   Token parts:', parts.length, '(should be 3)');
    
//     if (parts.length === 3) {
//       const header = JSON.parse(atob(parts[0]));
//       const payload = JSON.parse(atob(parts[1]));
      
//       console.log('   Header:', header);
//       console.log('   Payload:', payload);
//       console.log('   User email:', payload.sub || payload.email);
//       console.log('   Issued at:', new Date(payload.iat * 1000).toLocaleString());
//       console.log('   Expires at:', new Date(payload.exp * 1000).toLocaleString());
//       console.log('   Is expired?:', Date.now() >= payload.exp * 1000);
//     }
//   } catch (e) {
//     console.error('   ❌ Failed to parse token:', e);
//   }
  
//   // 3. Test endpoint
//   console.log('\n3️⃣ TESTING ENDPOINT:');
//   const testCode = 'GRP0000004'; // Change this to your actual invite code
//   const url = 'http://localhost:8080/groups/join-by-code';
  
//   console.log('   URL:', url);
//   console.log('   Method: POST');
//   console.log('   Invite code:', testCode);
  
//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`
//       },
//       body: JSON.stringify({ inviteCode: testCode })
//     });
    
//     console.log('\n4️⃣ RESPONSE:');
//     console.log('   Status:', response.status, response.statusText);
//     console.log('   Headers:', Object.fromEntries(response.headers.entries()));
    
//     const contentType = response.headers.get('content-type');
//     let data;
    
//     if (contentType && contentType.includes('application/json')) {
//       data = await response.json();
//       console.log('   Body (JSON):', data);
//     } else {
//       data = await response.text();
//       console.log('   Body (Text):', data);
//     }
    
//     if (response.ok) {
//       console.log('\n✅ SUCCESS! Joined group:', data.name);
//     } else {
//       console.log('\n❌ FAILED!');
//       if (response.status === 403) {
//         console.log('\n🔍 403 DEBUGGING:');
//         console.log('   - Check if backend SecurityConfig allows this endpoint');
//         console.log('   - Check if JWT filter is processing the token');
//         console.log('   - Check if @AuthenticationPrincipal is being used (should use @RequestHeader instead)');
//         console.log('   - Check backend logs for errors');
//       }
//     }
    
//     return { response, data };
//   } catch (error) {
//     console.error('\n❌ NETWORK ERROR:', error);
//     console.log('\n🔍 POSSIBLE CAUSES:');
//     console.log('   - Backend is not running');
//     console.log('   - CORS is blocking the request');
//     console.log('   - URL is wrong');
//     return { error };
//   }
// }

// // Run the test
// console.log('🧪 Running invite code endpoint test...\n');
// testInviteCodeEndpoint().then(() => {
//   console.log('\n=== TEST COMPLETE ===');
// });

// // Also test if other authenticated endpoints work
// async function testOtherEndpoints() {
//   console.log('\n\n=== TESTING OTHER ENDPOINTS FOR COMPARISON ===\n');
  
//   const accessToken = localStorage.getItem('accessToken');
//   if (!accessToken) {
//     console.error('❌ No access token');
//     return;
//   }
  
//   // Test getting user groups (this should work)
//   try {
//     console.log('Testing GET /groups (should work)...');
//     const response = await fetch('http://localhost:8080/groups', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });
    
//     console.log('GET /groups - Status:', response.status);
//     if (response.ok) {
//       const data = await response.json();
//       console.log('✅ GET /groups works! Got', data.length, 'groups');
//     } else {
//       console.log('❌ GET /groups failed:', response.statusText);
//     }
//   } catch (error) {
//     console.error('❌ GET /groups error:', error);
//   }
// }

// testOtherEndpoints();
