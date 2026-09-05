const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const notificationEmitter = require('../utils/notificationEmitter');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required shipping address fields',
      });
    }

    // Verify products and calculate amounts from database records
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with id ${item.product} not found`,
        });
      }

      if (!product.availability) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is currently out of stock`,
        });
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal,
        image: product.image,
      });
    }

    // Free delivery over ₹500 / $50, else ₹40 standard delivery fee
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const totalAmount = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      subtotal,
      deliveryFee,
      totalAmount,
      status: 'Pending',
    });

    // Create persistent admin notification & emit real-time event
    try {
      const notification = await Notification.create({
        recipientRole: 'admin',
        type: 'NEW_ORDER',
        title: 'New Order Received! 🛍️',
        message: `${shippingAddress.fullName} placed an order for ₹${totalAmount} (${validatedItems.length} item${validatedItems.length > 1 ? 's' : ''})`,
        order: order._id,
        orderData: {
          orderId: order._id,
          customerName: shippingAddress.fullName,
          totalAmount: order.totalAmount,
          itemsCount: validatedItems.length,
          status: order.status,
        },
        isRead: false,
      });

      notificationEmitter.emit('admin_notification', notification);
    } catch (notifErr) {
      console.error('[OrderController] Failed to dispatch admin notification:', notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email phone'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization: must be order owner or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this order',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
