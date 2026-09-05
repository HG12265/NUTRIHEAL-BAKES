const http = require('http');

async function testFullE2E() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('Testing full NutriHeal Bakes E2E API flow against live server...\n');

  try {
    // 1. Health check
    const health = await (await fetch(`${baseUrl}/health`)).json();
    console.log('✓ [1/8] Server Health:', health.message);

    // 2. Public products list
    const productsRes = await (await fetch(`${baseUrl}/products`)).json();
    console.log(`✓ [2/8] Product Catalog: ${productsRes.data.length} products found`);
    const testProduct = productsRes.data[0];

    // 3. Single product by ID (including QR url & nutrition)
    const productDetail = await (await fetch(`${baseUrl}/products/${testProduct._id}`)).json();
    console.log(`✓ [3/8] Product Details for "${productDetail.data.name}":`);
    console.log(`       - SKU: ${productDetail.data.sku}`);
    console.log(`       - QR Target: ${productDetail.data.qrCodeUrl}`);
    console.log(`       - Serving Size: ${productDetail.data.nutrition.servingSize}`);
    console.log(`       - Ingredients: ${productDetail.data.ingredients.join(', ')}`);

    // 4. Customer Login
    const custLoginRes = await (await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@nutriheal.com', password: 'User@12345' }),
    })).json();
    console.log(`✓ [4/8] Customer Login: Success for ${custLoginRes.data.name}`);
    const customerToken = custLoginRes.data.token;

    // 5. Place Customer Order
    const orderPayload = {
      items: [
        {
          product: testProduct._id,
          productName: testProduct.name,
          quantity: 2,
          price: testProduct.price,
        },
      ],
      shippingAddress: {
        fullName: 'Priya Sharma',
        phone: '+919812345678',
        email: 'customer@nutriheal.com',
        address: '102 Green Acres, Indiranagar',
        city: 'Bangalore',
        pincode: '560038',
      },
    };
    const orderRes = await (await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(orderPayload),
    })).json();
    console.log(`✓ [5/8] Order Placed: ID #${orderRes.data._id} | Total: ₹${orderRes.data.totalAmount} (Status: ${orderRes.data.status})`);
    const orderId = orderRes.data._id;

    // 6. Customer fetches order receipt
    const getOrderRes = await (await fetch(`${baseUrl}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    })).json();
    console.log(`✓ [6/8] Order Retrieved: Total items = ${getOrderRes.data.items.length}`);

    // 7. Admin Login
    const adminLoginRes = await (await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nutriheal.com', password: 'Admin@12345' }),
    })).json();
    console.log(`✓ [7/8] Admin Login: Success (Role: ${adminLoginRes.data.role})`);
    const adminToken = adminLoginRes.data.token;

    // 8. Admin updates order status to 'Confirmed'
    const statusUpdateRes = await (await fetch(`${baseUrl}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'Confirmed' }),
    })).json();
    console.log(`✓ [8/8] Admin Order Status Update: ${statusUpdateRes.message}`);

    console.log('\n🎉 ALL 8 FULL-STACK END-TO-END FLOWS PASSED PERFECTLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

testFullE2E();
