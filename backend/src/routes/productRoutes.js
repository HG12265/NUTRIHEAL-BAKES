const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public product routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin product routes
router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  upload.single('image'),
  productController.createProduct
);

router.put(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  upload.single('image'),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  productController.deleteProduct
);

router.patch(
  '/:id/toggle-availability',
  authenticateUser,
  authorizeAdmin,
  productController.toggleAvailability
);

router.post(
  '/:id/qr',
  authenticateUser,
  authorizeAdmin,
  productController.generateProductQR
);

router.get(
  '/:id/qr/download',
  authenticateUser,
  authorizeAdmin,
  productController.downloadProductQR
);

module.exports = router;
