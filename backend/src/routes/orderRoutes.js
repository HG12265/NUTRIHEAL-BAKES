const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/auth');

router.post('/', authenticateUser, orderController.createOrder);
router.get('/my-orders', authenticateUser, orderController.getMyOrders);
router.get('/:id', authenticateUser, orderController.getOrderById);

module.exports = router;
