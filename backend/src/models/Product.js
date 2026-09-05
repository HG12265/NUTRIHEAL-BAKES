const mongoose = require('mongoose');

const nutritionMetricsSchema = new mongoose.Schema(
  {
    energy: { type: Number, default: 0, min: [0, 'Energy cannot be negative'] },
    protein: { type: Number, default: 0, min: [0, 'Protein cannot be negative'] },
    carbohydrate: { type: Number, default: 0, min: [0, 'Carbohydrates cannot be negative'] },
    totalFat: { type: Number, default: 0, min: [0, 'Total Fat cannot be negative'] },
    dietaryFibre: { type: Number, default: 0, min: [0, 'Dietary Fibre cannot be negative'] },
    iron: { type: Number, default: 0, min: [0, 'Iron cannot be negative'] },
    calcium: { type: Number, default: 0, min: [0, 'Calcium cannot be negative'] },
    sodium: { type: Number, default: 0, min: [0, 'Sodium cannot be negative'] },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Cookies', 'Bread', 'Cakes', 'Desserts'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      trim: true,
    },
    image: {
      type: String,
      default: '/uploads/products/placeholder-bakery.jpg',
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
      min: [0, 'Price must be a positive number'],
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    nutrition: {
      servingSize: {
        type: String,
        default: '30 g',
        trim: true,
      },
      perServing: {
        type: nutritionMetricsSchema,
        default: () => ({}),
      },
      per100g: {
        type: nutritionMetricsSchema,
        default: () => ({}),
      },
    },
    ingredients: {
      type: [String],
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
    },
    storageInstructions: {
      type: String,
      default: 'Store in a cool, dry and hygienic place away from direct sunlight.',
      trim: true,
    },
    manufacturingDate: {
      type: Date,
      default: Date.now,
    },
    bestBeforeDate: {
      type: Date,
    },
    batchNumber: {
      type: String,
      trim: true,
      default: 'NHB-BATCH-001',
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
    qrCodeDataUrl: {
      type: String,
      default: '',
    },
    isDemoData: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to format JSON output
productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

module.exports = mongoose.model('Product', productSchema);
