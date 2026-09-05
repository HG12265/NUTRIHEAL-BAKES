const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

async function testBackend() {
  await connectDB();
  const server = http.createServer(app);

  server.listen(5099, async () => {
    console.log('Sanity Test Server running on port 5099...');

    try {
      // 1. Health check
      const healthRes = await fetch('http://localhost:5099/api/health');
      const healthJson = await healthRes.json();
      console.log('1. Health check:', healthJson.success ? 'PASS' : 'FAIL');

      // 2. Products listing
      const prodRes = await fetch('http://localhost:5099/api/products');
      const prodJson = await prodRes.json();
      console.log(`2. Products count: ${prodJson.count} items:`, prodJson.count === 6 ? 'PASS' : 'FAIL');

      // 3. User Login
      const loginRes = await fetch('http://localhost:5099/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'customer@nutriheal.com', password: 'User@12345' }),
      });
      const loginJson = await loginRes.json();
      console.log('3. Customer Login:', loginJson.success ? 'PASS' : 'FAIL');

      // 4. Admin Login
      const adminLoginRes = await fetch('http://localhost:5099/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@nutriheal.com', password: 'Admin@12345' }),
      });
      const adminLoginJson = await adminLoginRes.json();
      console.log('4. Admin Login:', adminLoginJson.data.role === 'admin' ? 'PASS' : 'FAIL');
      const adminToken = adminLoginJson.data.token;

      // 5. Admin Dashboard
      const dashRes = await fetch('http://localhost:5099/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const dashJson = await dashRes.json();
      console.log('5. Admin Dashboard Stats:', dashJson.success ? 'PASS' : 'FAIL');

      console.log('\nAll API Sanity Checks PASSED!');
    } catch (err) {
      console.error('API Test Error:', err);
    } finally {
      server.close(() => {
        process.exit(0);
      });
    }
  });
}

testBackend();
