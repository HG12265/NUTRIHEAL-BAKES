const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientRole: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    type: {
      type: String,
      enum: ['NEW_ORDER', 'ORDER_STATUS', 'STOCK_ALERT', 'GENERAL'],
      default: 'NEW_ORDER',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    orderData: {
      orderId: String,
      customerName: String,
      totalAmount: Number,
      itemsCount: Number,
      status: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick queries by recipient role, isRead, and createdAt
notificationSchema.index({ recipientRole: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
