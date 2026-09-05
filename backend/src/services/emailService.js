/**
 * Brevo (Sendinblue) Email Service for NutriHeal Bakes
 * Ultra-Modern, Mobile-First Responsive Transactional Email Templates
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const getEmailConfig = () => {
  return {
    apiKey: process.env.BREVO_API_KEY || '',
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'nutrihealbakes@gmail.com',
    senderName: process.env.BREVO_SENDER_NAME || 'NutriHeal Bakes',
    adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'nutrihealbakes@gmail.com',
    clientUrl: process.env.CLIENT_URL || 'https://nutriheal-bakes.vercel.app',
  };
};

/**
 * Base email dispatcher via Brevo API
 */
const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  const config = getEmailConfig();

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
 * Common Responsive Styles & Head
 */
const getEmailHead = (title) => `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>${title}</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F4EFE6; }
    
    /* Responsive Media Queries */
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }
      .mobile-padding {
        padding: 24px 16px !important;
      }
      .mobile-header-padding {
        padding: 28px 16px !important;
      }
      .mobile-full-width {
        width: 100% !important;
        display: block !important;
        box-sizing: border-box !important;
      }
      .mobile-btn {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
        padding: 14px 20px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .item-name {
        font-size: 14px !important;
      }
      .stat-badge {
        font-size: 13px !important;
        padding: 6px 14px !important;
      }
    }
  </style>
`;

/**
 * Template Helper: Generates Responsive Items Table
 */
const renderItemsTable = (items) => {
  if (!items || !items.length) return '';

  const rows = items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #EDF2F0; background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FAFCFA'};">
        <td style="padding: 14px 12px; vertical-align: middle;">
          <div style="font-weight: 700; color: #1E293B; font-size: 14px;" class="item-name">
            ${item.productName || item.name}
          </div>
          <div style="font-size: 12px; color: #64748B; margin-top: 3px;">
            ₹${item.price} each
          </div>
        </td>
        <td style="padding: 14px 10px; text-align: center; vertical-align: middle;">
          <span style="display: inline-block; background-color: #EBF4EE; color: #2D6A4F; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 12px;">
            × ${item.quantity}
          </span>
        </td>
        <td style="padding: 14px 12px; text-align: right; font-weight: 800; color: #2D6A4F; font-size: 15px; vertical-align: middle;">
          ₹${item.subtotal || item.price * item.quantity}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; border-spacing: 0; border: 1px solid #E2EBE5; border-radius: 12px; overflow: hidden; margin: 16px 0;">
      <thead>
        <tr style="background: linear-gradient(180deg, #F5F9F6 0%, #EBF4EE 100%);">
          <th style="padding: 12px; text-align: left; color: #2D6A4F; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
          <th style="padding: 12px; text-align: center; color: #2D6A4F; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
          <th style="padding: 12px; text-align: right; color: #2D6A4F; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Amount</th>
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
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const subject = `🛒 [New Order #${shortId}] ₹${order.totalAmount} from ${customerName} - NutriHeal Bakes`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      ${getEmailHead('New Order Received - NutriHeal Bakes')}
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4EFE6; margin: 0; padding: 24px 0; color: #1E293B;">
      
      <!-- Outer Wrapper -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4EFE6;">
        <tr>
          <td align="center" style="padding: 0 10px;">
            
            <!-- Email Container (Max 600px) -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05);" class="email-container">
              
              <!-- Brand Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%); padding: 36px 24px 30px; text-align: center; color: #FFFFFF;" class="mobile-header-padding">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <div style="font-size: 26px; font-weight: 900; letter-spacing: 0.8px; color: #FFFFFF; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                          🌿 NUTRIHEAL BAKES
                        </div>
                        <div style="font-size: 13px; font-weight: 500; color: #D8F3DC; margin-top: 5px; letter-spacing: 0.5px;">
                          Healthy Bakes • Smart Nutrition
                        </div>
                        <div style="margin-top: 18px; display: inline-block; background-color: rgba(255,255,255,0.18); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); padding: 7px 18px; border-radius: 30px; font-size: 13px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.3px;" class="stat-badge">
                          🛍️ NEW CUSTOMER ORDER RECEIVED
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Body -->
              <tr>
                <td style="padding: 32px 28px;" class="mobile-padding">
                  
                  <!-- Greeting & Notice -->
                  <p style="font-size: 16px; margin: 0 0 12px 0; color: #0F172A; font-weight: 700;">
                    Hello Admin,
                  </p>
                  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
                    A new customer order has been placed by <strong style="color: #0F172A;">${customerName}</strong>. Please review the order details below and begin preparation.
                  </p>

                  <!-- Order Meta Card -->
                  <div style="background: #F8FAF9; border: 1px solid #E2EBE5; border-left: 5px solid #2D6A4F; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td class="mobile-stack" style="vertical-align: top; padding-bottom: 8px;">
                          <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748B; letter-spacing: 0.5px;">Order ID</div>
                          <div style="font-size: 15px; font-weight: 800; color: #1E293B; font-family: monospace; margin-top: 2px;">#${orderId}</div>
                        </td>
                        <td class="mobile-stack" align="right" style="vertical-align: top; text-align: right;">
                          <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748B; letter-spacing: 0.5px;">Order Placed</div>
                          <div style="font-size: 13px; font-weight: 600; color: #475569; margin-top: 2px;">${orderDate}</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top: 1px dashed #CBD5E1; padding-top: 10px; margin-top: 10px;">
                          <span style="display: inline-block; background-color: #FEF3C7; color: #92400E; font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 8px;">
                            Status: Pending Confirmation
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Order Items Table Section -->
                  <div style="margin-bottom: 24px;">
                    <div style="font-size: 14px; font-weight: 800; color: #1E293B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                      📦 Order Items (${order.items?.length || 0})
                    </div>
                    ${renderItemsTable(order.items)}
                  </div>

                  <!-- Pricing Summary Card -->
                  <div style="background-color: #F8FAF9; border: 1px solid #E2EBE5; border-radius: 12px; padding: 18px 20px; margin-bottom: 26px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 4px 0; font-size: 14px; color: #64748B;">Items Subtotal:</td>
                        <td style="padding: 4px 0; font-size: 14px; font-weight: 600; color: #1E293B; text-align: right;">₹${order.subtotal}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 14px; color: #64748B;">Delivery Fee:</td>
                        <td style="padding: 4px 0; font-size: 14px; font-weight: 600; color: #1E293B; text-align: right;">
                          ${order.deliveryFee === 0 ? '<span style="color: #2D6A4F; font-weight: 700;">FREE</span>' : `₹${order.deliveryFee}`}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top: 2px dashed #CBD5E1; padding-top: 12px; margin-top: 8px;"></td>
                      </tr>
                      <tr>
                        <td style="font-size: 17px; font-weight: 800; color: #1E293B;">Grand Total:</td>
                        <td style="font-size: 20px; font-weight: 900; color: #2D6A4F; text-align: right;">₹${order.totalAmount}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Customer Delivery Card -->
                  <div style="background-color: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin-bottom: 30px;">
                    <div style="font-size: 13px; font-weight: 800; color: #1E293B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
                      📍 Delivery Information
                    </div>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #334155; line-height: 1.6;">
                      <tr>
                        <td style="padding: 2px 0;"><strong>Customer:</strong> ${customerName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 2px 0;"><strong>Phone:</strong> <a href="tel:${order.shippingAddress?.phone || ''}" style="color: #2D6A4F; text-decoration: none; font-weight: 600;">${order.shippingAddress?.phone || 'N/A'}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 2px 0;"><strong>Email:</strong> <a href="mailto:${order.shippingAddress?.email || ''}" style="color: #2D6A4F; text-decoration: none;">${order.shippingAddress?.email || 'N/A'}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 2px 0;"><strong>Address:</strong> ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.pincode || ''}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- CTA Button -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${adminOrderUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%); color: #FFFFFF; font-weight: 800; font-size: 15px; padding: 16px 36px; border-radius: 12px; text-decoration: none; box-shadow: 0 6px 18px rgba(45,106,79,0.35); letter-spacing: 0.3px;" class="mobile-btn">
                          Manage Order in Admin Dashboard →
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 24px; text-align: center; color: #64748B; font-size: 12px; line-height: 1.6;">
                  <div style="font-weight: 700; color: #334155; margin-bottom: 4px;">NUTRIHEAL BAKES AUTOMATED SYSTEM</div>
                  <div>Healthy Bakes • Smart Nutrition • Certified Organic & Wholesome</div>
                  <div style="margin-top: 8px; color: #94A3B8; font-size: 11px;">
                    © ${new Date().getFullYear()} NutriHeal Bakes. All rights reserved.
                  </div>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

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
 * Ultra-Modern & Fully Responsive
 */
exports.sendCustomerOrderStatusUpdate = async (order, newStatus) => {
  const config = getEmailConfig();
  const customerEmail = order.shippingAddress?.email || (order.user && order.user.email);
  const customerName = order.shippingAddress?.fullName || (order.user && order.user.name) || 'Valued Customer';
  const orderId = order._id ? order._id.toString() : '';
  const shortId = orderId ? orderId.slice(-6).toUpperCase() : '';
  const customerOrderUrl = `${config.clientUrl}/orders/${orderId}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  if (!customerEmail) {
    console.warn(`[Brevo Email] No customer email found for order ${orderId}`);
    return { success: false, error: 'No recipient email' };
  }

  // Visual status configurations
  const statusDetails = {
    Confirmed: {
      badge: 'Order Confirmed ✅',
      badgeBg: '#DCFCE7',
      badgeColor: '#166534',
      badgeBorder: '#BBF7D0',
      icon: '✅',
      title: 'Your Order is Confirmed!',
      subtitle: 'Our bakers are getting ready to prepare your fresh bakes.',
      message: 'Great news! We have verified your order and our artisan bakers are gearing up with wholesome, nutritious ingredients to bake fresh goodness for you.',
      subject: `✅ Order #${shortId} Confirmed! We're preparing your fresh bakes - NutriHeal Bakes`,
    },
    Preparing: {
      badge: 'Baking in Progress 👩‍🍳',
      badgeBg: '#FEF3C7',
      badgeColor: '#92400E',
      badgeBorder: '#FDE68A',
      icon: '👩‍🍳',
      title: 'Fresh Bakes in the Oven!',
      subtitle: 'Crafted with 100% whole grains & zero refined sugars.',
      message: 'Our bakers are currently handcrafting your nutritious treats. Packed with fiber, natural sweeteners, and zero artificial preservatives.',
      subject: `👩‍🍳 Your Fresh Bakes are Being Prepared! (Order #${shortId}) - NutriHeal Bakes`,
    },
    'Out for Delivery': {
      badge: 'Out for Delivery 🚚',
      badgeBg: '#DBEAFE',
      badgeColor: '#1E40AF',
      badgeBorder: '#BFDBFE',
      icon: '🚚',
      title: 'Your Order is On the Way!',
      subtitle: 'Our delivery partner is en route to your doorstep.',
      message: 'Your freshly baked package has been safely dispatched and is heading your way. Keep your phone handy for easy delivery.',
      subject: `🚚 Order #${shortId} is Out for Delivery! - NutriHeal Bakes`,
    },
    Delivered: {
      badge: 'Delivered 🎉',
      badgeBg: '#DCFCE7',
      badgeColor: '#166534',
      badgeBorder: '#BBF7D0',
      icon: '🎉',
      title: 'Order Delivered! Enjoy Every Bite',
      subtitle: 'Nutritious, delicious, and guilt-free snacking.',
      message: 'Your NutriHeal Bakes package has arrived! We hope you love the taste and nourishing benefits. Scan the QR code on the packaging anytime for ingredient insights.',
      subject: `🎉 Order #${shortId} Delivered! Enjoy your healthy bakes - NutriHeal Bakes`,
    },
    Cancelled: {
      badge: 'Order Cancelled ❌',
      badgeBg: '#FEE2E2',
      badgeColor: '#991B1B',
      badgeBorder: '#FECACA',
      icon: '❌',
      title: 'Order Status: Cancelled',
      subtitle: 'Your order was cancelled.',
      message: 'Your order has been cancelled. If you did not request this or have any queries, please reply directly or reach out to us at nutrihealbakes@gmail.com.',
      subject: `❌ Update regarding your Order #${shortId} - NutriHeal Bakes`,
    },
  };

  const currentStatusInfo = statusDetails[newStatus] || {
    badge: `Status: ${newStatus}`,
    badgeBg: '#F1F5F9',
    badgeColor: '#334155',
    badgeBorder: '#E2E8F0',
    icon: '📦',
    title: `Order Status: ${newStatus}`,
    subtitle: `Your order status was updated to ${newStatus}.`,
    message: `Your order status has been updated to ${newStatus}.`,
    subject: `Order #${shortId} Status Update: ${newStatus} - NutriHeal Bakes`,
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      ${getEmailHead(`${currentStatusInfo.title} - NutriHeal Bakes`)}
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4EFE6; margin: 0; padding: 24px 0; color: #1E293B;">
      
      <!-- Outer Wrapper -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4EFE6;">
        <tr>
          <td align="center" style="padding: 0 10px;">
            
            <!-- Email Container (Max 600px) -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05);" class="email-container">
              
              <!-- Brand Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%); padding: 36px 24px 30px; text-align: center; color: #FFFFFF;" class="mobile-header-padding">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <div style="font-size: 26px; font-weight: 900; letter-spacing: 0.8px; color: #FFFFFF; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                          🌿 NUTRIHEAL BAKES
                        </div>
                        <div style="font-size: 13px; font-weight: 500; color: #D8F3DC; margin-top: 5px; letter-spacing: 0.5px;">
                          Healthy Bakes • Smart Nutrition
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Body -->
              <tr>
                <td style="padding: 32px 28px;" class="mobile-padding">
                  
                  <!-- Status Hero Banner -->
                  <div style="text-align: center; margin-bottom: 28px;">
                    <div style="display: inline-block; background-color: ${currentStatusInfo.badgeBg}; color: ${currentStatusInfo.badgeColor}; border: 1px solid ${currentStatusInfo.badgeBorder}; padding: 8px 22px; border-radius: 30px; font-size: 14px; font-weight: 800; letter-spacing: 0.3px;" class="stat-badge">
                      ${currentStatusInfo.badge}
                    </div>
                    <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin: 18px 0 6px 0; letter-spacing: -0.3px;">
                      ${currentStatusInfo.title}
                    </h2>
                    <div style="font-size: 14px; color: #2D6A4F; font-weight: 600; margin-bottom: 12px;">
                      ${currentStatusInfo.subtitle}
                    </div>
                    <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0; max-width: 480px; margin: 0 auto;">
                      ${currentStatusInfo.message}
                    </p>
                  </div>

                  <!-- Order Meta Card -->
                  <div style="background: #F8FAF9; border: 1px solid #E2EBE5; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td class="mobile-stack" style="vertical-align: top; padding-bottom: 6px;">
                          <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748B; letter-spacing: 0.5px;">Order Reference</div>
                          <div style="font-size: 15px; font-weight: 800; color: #1E293B; font-family: monospace; margin-top: 2px;">#${orderId}</div>
                        </td>
                        <td class="mobile-stack" align="right" style="vertical-align: top; text-align: right;">
                          <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748B; letter-spacing: 0.5px;">Order Date</div>
                          <div style="font-size: 13px; font-weight: 600; color: #475569; margin-top: 2px;">${orderDate}</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Order Items Table Section -->
                  <div style="margin-bottom: 24px;">
                    <div style="font-size: 14px; font-weight: 800; color: #1E293B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                      📦 Summary of Your Bakes (${order.items?.length || 0})
                    </div>
                    ${renderItemsTable(order.items)}
                  </div>

                  <!-- Pricing Summary Card -->
                  <div style="background-color: #F8FAF9; border: 1px solid #E2EBE5; border-radius: 12px; padding: 18px 20px; margin-bottom: 26px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 4px 0; font-size: 14px; color: #64748B;">Items Subtotal:</td>
                        <td style="padding: 4px 0; font-size: 14px; font-weight: 600; color: #1E293B; text-align: right;">₹${order.subtotal}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 14px; color: #64748B;">Delivery Fee:</td>
                        <td style="padding: 4px 0; font-size: 14px; font-weight: 600; color: #1E293B; text-align: right;">
                          ${order.deliveryFee === 0 ? '<span style="color: #2D6A4F; font-weight: 700;">FREE</span>' : `₹${order.deliveryFee}`}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top: 2px dashed #CBD5E1; padding-top: 12px; margin-top: 8px;"></td>
                      </tr>
                      <tr>
                        <td style="font-size: 17px; font-weight: 800; color: #1E293B;">Grand Total:</td>
                        <td style="font-size: 20px; font-weight: 900; color: #2D6A4F; text-align: right;">₹${order.totalAmount}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Delivery Address Card -->
                  <div style="background-color: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin-bottom: 30px;">
                    <div style="font-size: 13px; font-weight: 800; color: #1E293B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                      📍 Delivering To
                    </div>
                    <div style="font-size: 14px; color: #334155; line-height: 1.6;">
                      <div style="font-weight: 700; color: #0F172A;">${customerName}</div>
                      <div>${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.pincode || ''}</div>
                      <div style="margin-top: 4px; color: #64748B; font-size: 13px;">Phone: ${order.shippingAddress?.phone || 'N/A'}</div>
                    </div>
                  </div>

                  <!-- CTA Button -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${customerOrderUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%); color: #FFFFFF; font-weight: 800; font-size: 15px; padding: 16px 36px; border-radius: 12px; text-decoration: none; box-shadow: 0 6px 18px rgba(45,106,79,0.35); letter-spacing: 0.3px;" class="mobile-btn">
                          View & Track Your Order →
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Nutrition Guarantee Banner -->
              <tr>
                <td style="background-color: #F8FAF9; padding: 18px 24px; text-align: center; border-top: 1px solid #E2EBE5; border-bottom: 1px solid #E2EBE5;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <span style="font-size: 13px; color: #2D6A4F; font-weight: 700;">
                          🌱 100% Whole Grain • Zero Refined Flour • Natural Sweeteners
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F1F5F9; padding: 24px; text-align: center; color: #64748B; font-size: 12px; line-height: 1.6;">
                  <div style="font-weight: 700; color: #334155; margin-bottom: 4px;">NUTRIHEAL BAKES</div>
                  <div>Thank you for choosing health and wholesome nutrition!</div>
                  <div style="margin-top: 6px;">Questions? Contact us at <a href="mailto:nutrihealbakes@gmail.com" style="color: #2D6A4F; font-weight: 700; text-decoration: none;">nutrihealbakes@gmail.com</a></div>
                  <div style="margin-top: 10px; color: #94A3B8; font-size: 11px;">
                    © ${new Date().getFullYear()} NutriHeal Bakes. All rights reserved.
                  </div>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

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
