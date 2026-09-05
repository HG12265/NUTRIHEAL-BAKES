const Product = require('../models/Product');
const slugify = require('../utils/slugify');
const { generateQRCodeDataUrl, generateQRCodeBuffer } = require('../utils/qrGenerator');

// @desc    Get all products (with search and category filter)
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, available } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (available !== undefined) {
      query.availability = available === 'true';
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if valid ObjectId or query by slug / SKU
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ $or: [{ slug: id }, { sku: id }] });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Ensure QR code is present if not already generated
    if (!product.qrCodeDataUrl) {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const targetUrl = `${clientUrl}/product/${product._id}`;
      product.qrCodeUrl = targetUrl;
      product.qrCodeDataUrl = await generateQRCodeDataUrl(targetUrl);
      await product.save();
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    // Parse JSON fields if sent via FormData
    if (typeof productData.nutrition === 'string') {
      productData.nutrition = JSON.parse(productData.nutrition);
    }
    if (typeof productData.ingredients === 'string') {
      productData.ingredients = JSON.parse(productData.ingredients);
    }
    if (typeof productData.allergens === 'string') {
      productData.allergens = JSON.parse(productData.allergens);
    }

    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }

    // Generate unique slug
    let baseSlug = slugify(productData.name || 'bakery-product');
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    productData.slug = slug;

    // Generate unique SKU if not provided
    if (!productData.sku) {
      productData.sku = `NHB-${Date.now().toString().slice(-6)}`;
    }

    const product = new Product(productData);

    // Generate QR Code mapping to unique product URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const targetUrl = `${clientUrl}/product/${product._id}`;
    product.qrCodeUrl = targetUrl;
    product.qrCodeDataUrl = await generateQRCodeDataUrl(targetUrl);

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = { ...req.body };

    if (typeof updateData.nutrition === 'string') {
      updateData.nutrition = JSON.parse(updateData.nutrition);
    }
    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }
    if (typeof updateData.allergens === 'string') {
      updateData.allergens = JSON.parse(updateData.allergens);
    }

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    // Update slug if name changed
    if (updateData.name && updateData.name !== product.name) {
      let baseSlug = slugify(updateData.name);
      let slug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // Ensure QR Code points correctly
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const targetUrl = `${clientUrl}/product/${product._id}`;
    updateData.qrCodeUrl = targetUrl;
    if (!product.qrCodeDataUrl) {
      updateData.qrCodeDataUrl = await generateQRCodeDataUrl(targetUrl);
    }

    product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product availability
// @route   PATCH /api/products/:id/toggle-availability
// @access  Private/Admin
exports.toggleAvailability = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.availability = !product.availability;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product availability updated to ${product.availability ? 'Available' : 'Out of Stock'}`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate / Regenerate QR Code for a product
// @route   POST /api/products/:id/qr
// @access  Private/Admin
exports.generateProductQR = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const targetUrl = `${clientUrl}/product/${product._id}`;

    const qrDataUrl = await generateQRCodeDataUrl(targetUrl);
    product.qrCodeUrl = targetUrl;
    product.qrCodeDataUrl = qrDataUrl;
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        qrCodeUrl: product.qrCodeUrl,
        qrCodeDataUrl: product.qrCodeDataUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download QR Code image as PNG file
// @route   GET /api/products/:id/qr/download
// @access  Private/Admin
exports.downloadProductQR = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const targetUrl = `${clientUrl}/product/${product._id}`;
    const buffer = await generateQRCodeBuffer(targetUrl);

    const safeFilename = `${slugify(product.name)}-qr.png`;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};
