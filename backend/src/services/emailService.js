/**
 * Brevo (Sendinblue) Email Service for NutriHeal Bakes
 * Handles transactional emails for new orders and order status updates.
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const getEmailConfig = () => {
  return {
    apiKey: process.env.BREVO_API_KEY || '',
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'nutrihealbakes@gmail.com',
    senderName: process.env.BREVO_SENDER_NAME || 'NutriHeal Bakes',
    adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'nutrihealbakes@gmail.com',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  };
};

/**
 * Base email dispatcher via Brevo API
 */
const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  const config = getEmailConfig();

  // If no Brevo API key is configured yet, log preview in dev mode gracefully
  if (!config.apiKey || config.apiKey === 'your_brevo_api_key_here') {
    console.log('\n=========================================');
    console.log('📧 [BREVO EMAIL SERVICE - DEV SIMULATION]');
    console.log(`📤 From: ${config.senderName} <${config.senderEmail}>`);
    console.log(`📥 To: ${toName || ''} <${toEmail}>`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`ℹ️ Note: Set BREVO_API_KEY in backend/.env to send real emails.`);
    console.log('=========================================\n');
    return { success: true, simulated: true };
  }

  try {
    const payload = {
      sender: {
        name: config.senderName,
        email: config.senderEmail,
      },
      to: [
        {
          email: toEmail,
          name: toName || toEmail,
        },
      ],
      subject,
      htmlContent,
    };

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': config.apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Brevo Email Error]:', data);
      return { success: false, error: data };
    }

    console.log(`✅ [Brevo Email Sent] To: ${toEmail} | MessageID: ${data.messageId || 'OK'}`);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error('[Brevo Email Dispatch Exception]:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Template Helper: Generates HTML table of items
 */
const renderItemsTable = (items) => {
  if (!items || !items.length) return '';

  const rows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #EEEEEE;">
        <td style="padding: 12px 8px; font-weight: 600; color: #2D3748;">
          ${item.productName || item.name}
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #4A5568;">
          × ${item.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; color: #4A5568;">
          ₹${item.price}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 700; color: #4E8C5D;">
          ₹${item.subtotal || item.price * item.quantity}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
      <thead>
        <tr style="background-color: #F7FAF7; border-bottom: 2px solid #E2E8F0; text-align: left;">
          <th style="padding: 10px 8px; color: #4E8C5D; font-size: 13px;">Item</th>
          <th style="padding: 10px 8px; text-align: center; color: #4E8C5D; font-size: 13px;">Qty</th>
          <th style="padding: 10px 8px; text-align: right; color: #4E8C5D; font-size: 13px;">Price</th>
          <th style="padding: 10px 8px; text-align: right; color: #4E8C5D; font-size: 13px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

/**
 * 1. Admin Email Notification: New Order Placed
 * Sent to nutrihealbakes@gmail.com
 */
exports.sendAdminNewOrderNotification = async (order) => {
  const config = getEmailConfig();
  const customerName = order.shippingAddress?.fullName || 'Customer';
  const orderId = order._id ? order._id.toString() : '';
  const shortId = orderId ? orderId.slice(-6).toUpperCase() : '';
  const adminOrderUrl = `${config.clientUrl}/admin/orders`;

  const subject = `🛒 [New Order #${shortId}] ₹${order.totalAmount} from ${customerName} - NutriHeal Bakes`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Received</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F5EC; margin: 0; padding: 24px; color: #2D3748;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4E8C5D 0%, #3D7349 100%); padding: 28px 24px; text-align: center; color: #FFFFFF;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">🌿 NUTRIHEAL BAKES</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Healthy Bakes • Smart Nutrition</p>
          <div style="margin-top: 14px; display: inline-block; background-color: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700;">
            🛍️ New Customer Order Received!
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 28px 24px;">
          <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>Admin</strong>,</p>
          <p style="font-size: 14px; color: #4A5568; line-height: 1.5; margin: 0 0 20px 0;">
            A new order has been placed by <strong>${customerName}</strong>. Please review the details below and prepare the fresh bakes for fulfillment.
          </p>

          <!-- Order Meta Card -->
          <div style="background-color: #F7FAF7; border-left: 4px solid #4E8C5D; padding: 14px 16px; border-radius: 8px; margin-bottom: 20px;">
            <div style="font-size: 13px; color: #718096; margin-bottom: 4px;">Order Reference:</div>
            <div style="font-size: 16px; font-weight: 800; color: #2D3748;">#${orderId}</div>
            <div style="font-size: 13px; color: #4E8C5D; font-weight: 700; margin-top: 6px;">Status: Pending Confirmation</div>
          </div>

          <!-- Items Ordered -->
          <h3 style="font-size: 15px; font-weight: 700; margin: 20px 0 8px 0; color: #2D3748; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            📦 Items Ordered (${order.items?.length || 0})
          </h3>
          ${renderItemsTable(order.items)}

          <!-- Price Summary -->
          <div style="background-color: #FAF8F5; padding: 14px 18px; border-radius: 10px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #4A5568; margin-bottom: 6px;">
              <span>Subtotal:</span>
              <span style="font-weight: 600;">₹${order.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #4A5568; margin-bottom: 8px;">
              <span>Delivery Fee:</span>
              <span style="font-weight: 600;">${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div style="border-top: 2px dashed #E2E8F0; padding-top: 8px; display: flex; justify-content: space-between; font-size: 17px; font-weight: 800; color: #4E8C5D;">
              <span>Grand Total:</span>
              <span>₹${order.totalAmount}</span>
            </div>
          </div>

          <!-- Customer & Delivery Address -->
          <h3 style="font-size: 15px; font-weight: 700; margin: 24px 0 8px 0; color: #2D3748; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            📍 Delivery Details
          </h3>
          <div style="font-size: 14px; color: #4A5568; line-height: 1.6; background-color: #F8FAFC; padding: 14px 16px; border-radius: 8px;">
            <div><strong>Name:</strong> ${customerName}</div>
            <div><strong>Phone:</strong> ${order.shippingAddress?.phone || 'N/A'}</div>
            <div><strong>Email:</strong> ${order.shippingAddress?.email || 'N/A'}</div>
            <div><strong>Address:</strong> ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.pincode || ''}</div>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0 10px 0;">
            <a href="${adminOrderUrl}" style="display: inline-block; background-color: #4E8C5D; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 15px; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(78,140,93,0.35);">
              Manage Order in Admin Dashboard →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #F0EDE5; padding: 18px 24px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #E2E8F0;">
          NutriHeal Bakes Automated Notification System • ${new Date().getFullYear()}
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    toEmail: config.adminEmail,
    toName: 'NutriHeal Admin',
    subject,
    htmlContent,
  });
};

/**
 * 2. Customer Email Notification: Order Status Update
 * Triggered on Confirmed, Preparing, Out for Delivery, Delivered, Cancelled
 */
exports.sendCustomerOrderStatusUpdate = async (order, newStatus) => {
  const config = getEmailConfig();
  const customerEmail = order.shippingAddress?.email || (order.user && order.user.email);
  const customerName = order.shippingAddress?.fullName || (order.user && order.user.name) || 'Valued Customer';
  const orderId = order._id ? order._id.toString() : '';
  const shortId = orderId ? orderId.slice(-6).toUpperCase() : '';
  const customerOrderUrl = `${config.clientUrl}/orders/${orderId}`;

  if (!customerEmail) {
    console.warn(`[Brevo Email] No customer email found for order ${orderId}`);
    return { success: false, error: 'No recipient email' };
  }

  // Status configuration details
  const statusDetails = {
    Confirmed: {
      badge: 'Order Confirmed ✅',
      badgeBg: '#E8F5E9',
      badgeColor: '#2E7D32',
      title: 'Your Order has been Confirmed!',
      message: 'Great news! We have verified your order and our bakers are preparing to bake fresh, nutrient-rich goodies for you.',
      subject: `✅ Order #${shortId} Confirmed! We're preparing your fresh bakes - NutriHeal Bakes`,
    },
    Preparing: {
      badge: 'Baking in Progress 👩‍🍳',
      badgeBg: '#FFF3E0',
      badgeColor: '#E65100',
      title: 'Your Fresh Bakes are in the Oven!',
      message: 'Our bakers are currently handcrafting your order with pure healthy ingredients, zero refined flour and whole-grain goodness.',
      subject: `👩‍🍳 Your Fresh Bakes are Being Prepared! (Order #${shortId}) - NutriHeal Bakes`,
    },
    'Out for Delivery': {
      badge: 'Out for Delivery 🚚',
      badgeBg: '#E3F2FD',
      badgeColor: '#1565C0',
      title: 'Your Fresh Bakes are On the Way!',
      message: 'Our delivery partner has picked up your package and is heading towards your location. Keep your phone handy!',
      subject: `🚚 Order #${shortId} is Out for Delivery! - NutriHeal Bakes`,
    },
    Delivered: {
      badge: 'Delivered 🎉',
      badgeBg: '#E8F5E9',
      badgeColor: '#2E7D32',
      title: 'Your Order Has Been Delivered!',
      message: 'Your fresh healthy bakes have been delivered. We hope you love the taste and nutrition! Scan the QR code on the packaging anytime for ingredient insights.',
      subject: `🎉 Order #${shortId} Delivered! Enjoy your healthy bakes - NutriHeal Bakes`,
    },
    Cancelled: {
      badge: 'Order Cancelled ❌',
      badgeBg: '#FFEBEE',
      badgeColor: '#C62828',
      title: 'Order Status Update: Cancelled',
      message: 'Your order has been cancelled. If you have any questions or this was a mistake, please reach out to us at nutrihealbakes@gmail.com.',
      subject: `❌ Update regarding your Order #${shortId} - NutriHeal Bakes`,
    },
  };

  const currentStatusInfo = statusDetails[newStatus] || {
    badge: `Status: ${newStatus}`,
    badgeBg: '#F1EFEA',
    badgeColor: '#4E8C5D',
    title: `Order Status: ${newStatus}`,
    message: `Your order status has been updated to ${newStatus}.`,
    subject: `Order #${shortId} Status Update: ${newStatus} - NutriHeal Bakes`,
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${currentStatusInfo.title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F5EC; margin: 0; padding: 24px; color: #2D3748;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4E8C5D 0%, #3D7349 100%); padding: 28px 24px; text-align: center; color: #FFFFFF;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">🌿 NUTRIHEAL BAKES</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Healthy Bakes • Smart Nutrition</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 24px;">
          
          <!-- Status Badge Banner -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: ${currentStatusInfo.badgeBg}; color: ${currentStatusInfo.badgeColor}; padding: 8px 18px; border-radius: 24px; font-size: 14px; font-weight: 800; border: 1px solid rgba(0,0,0,0.05);">
              ${currentStatusInfo.badge}
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #2D3748; margin: 16px 0 8px 0;">
              ${currentStatusInfo.title}
            </h2>
            <p style="font-size: 14px; color: #4A5568; line-height: 1.6; margin: 0;">
              ${currentStatusInfo.message}
            </p>
          </div>

          <!-- Order Summary Card -->
          <div style="background-color: #F7FAF7; border-radius: 12px; padding: 16px 20px; margin: 24px 0; border: 1px solid #E8EFE9;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 10px;">
              <div>
                <span style="font-size: 12px; color: #718096; display: block;">Order Reference</span>
                <span style="font-size: 15px; font-weight: 800; color: #2D3748;">#${orderId}</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 12px; color: #718096; display: block;">Total Amount</span>
                <span style="font-size: 16px; font-weight: 800; color: #4E8C5D;">₹${order.totalAmount}</span>
              </div>
            </div>

            <!-- Items Table -->
            ${renderItemsTable(order.items)}
          </div>

          <!-- Delivery Address -->
          <div style="background-color: #F8FAFC; padding: 14px 16px; border-radius: 8px; font-size: 13px; color: #4A5568; line-height: 1.5; margin-bottom: 24px;">
            <strong style="color: #2D3748;">Delivering to:</strong><br>
            ${customerName}<br>
            ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.pincode || ''}<br>
            Phone: ${order.shippingAddress?.phone || 'N/A'}
          </div>

          <!-- Track Order CTA Button -->
          <div style="text-align: center; margin: 28px 0 10px 0;">
            <a href="${customerOrderUrl}" style="display: inline-block; background-color: #4E8C5D; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 15px; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(78,140,93,0.35);">
              View & Track Your Order →
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #F0EDE5; padding: 18px 24px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #E2E8F0;">
          <p style="margin: 0 0 6px 0;">Thank you for choosing wholesome, healthy nutrition with <strong>NutriHeal Bakes</strong>!</p>
          <p style="margin: 0; font-size: 11px;">Questions? Contact us anytime at <a href="mailto:nutrihealbakes@gmail.com" style="color: #4E8C5D; text-decoration: none;">nutrihealbakes@gmail.com</a></p>
        </div>

      </div>
    </body>
    </html>
  `;

  return sendEmail({
    toEmail: customerEmail,
    toName: customerName,
    subject: currentStatusInfo.subject,
    htmlContent,
  });
};
