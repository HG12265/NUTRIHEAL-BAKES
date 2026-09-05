const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const notificationController = require('../controllers/notificationController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticateUser, authorizeAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Notification routes
router.get('/notifications/stream', notificationController.streamNotifications);
router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.put('/notifications/read-all', notificationController.markAllAsRead);

module.exports = router;

