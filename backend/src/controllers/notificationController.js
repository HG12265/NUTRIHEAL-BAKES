const Notification = require('../models/Notification');
const notificationEmitter = require('../utils/notificationEmitter');

// @desc    Get admin notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
exports.getNotifications = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;

    const notifications = await Notification.find({ recipientRole: 'admin' })
      .sort({ createdAt: -1 })
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      recipientRole: 'admin',
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    const unreadCount = await Notification.countDocuments({
      recipientRole: 'admin',
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      data: notification,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all admin notifications as read
// @route   PUT /api/admin/notifications/read-all
// @access  Private/Admin
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipientRole: 'admin', isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stream real-time notifications via SSE
// @route   GET /api/admin/notifications/stream
// @access  Private/Admin (or via query token)
exports.streamNotifications = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Send initial connected payload
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE stream connected' })}\n\n`);

  // Handler for new order events
  const onNewNotification = (notification) => {
    try {
      res.write(`data: ${JSON.stringify({ type: 'NOTIFICATION', data: notification })}\n\n`);
    } catch (err) {
      console.error('SSE write error:', err);
    }
  };

  notificationEmitter.on('admin_notification', onNewNotification);

  // Send keepalive ping every 25 seconds
  const pingInterval = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch (err) {
      clearInterval(pingInterval);
    }
  }, 25000);

  // Clean up on disconnect
  req.on('close', () => {
    clearInterval(pingInterval);
    notificationEmitter.removeListener('admin_notification', onNewNotification);
  });
};
