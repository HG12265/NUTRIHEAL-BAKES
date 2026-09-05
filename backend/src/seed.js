require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const slugify = require('./utils/slugify');
const { generateQRCodeDataUrl } = require('./utils/qrGenerator');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutriheal_bakes');
    console.log('[Seed] Connected to MongoDB');
  } catch (error) {
    console.error(`[Seed] DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Ragi Jaggery Cookies',
    category: 'Cookies',
    price: 160,
    description: 'Crispy artisanal cookies crafted from mineral-rich finger millet (Ragi) and organic palm jaggery. Naturally gluten-free and sweetened without refined sugars.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    sku: 'NHB-RAG-001',
    availability: true,
    isDemoData: true,
    batchNumber: 'NHB-RAG-2026-01',
    storageInstructions: 'Store in an airtight container at room temperature away from moisture.',
    manufacturingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    bestBeforeDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    nutrition: {
      servingSize: '30 g (2 cookies)',
      perServing: {
        energy: 135,
        protein: 3.2,
        carbohydrate: 21.0,
        totalFat: 4.5,
        dietaryFibre: 2.8,
        iron: 1.8,
        calcium: 98,
        sodium: 45,
      },
      per100g: {
        energy: 450,
        protein: 10.7,
        carbohydrate: 70.0,
        totalFat: 15.0,
        dietaryFibre: 9.3,
        iron: 6.0,
        calcium: 326,
        sodium: 150,
      },
    },
    ingredients: [
      'Finger Millet (Ragi) Flour',
      'Organic Palm Jaggery',
      'Cold Pressed Coconut Oil',
      'Cardamom Powder',
      'Rock Salt',
    ],
    allergens: [],
  },
  {
    name: 'Multimillet Cookies',
    category: 'Cookies',
    price: 180,
    description: 'Nutrient-packed crunch made with a blend of foxtail, little, and kodo millets, baked gently with pure A2 cow ghee and crunchy almond flakes.',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    sku: 'NHB-MLT-002',
    availability: true,
    isDemoData: true,
    batchNumber: 'NHB-MLT-2026-02',
    storageInstructions: 'Store in a cool and dry place. Keep sealed after opening.',
    manufacturingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    bestBeforeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    nutrition: {
      servingSize: '30 g (2 cookies)',
      perServing: {
        energy: 140,
        protein: 3.6,
        carbohydrate: 20.5,
        totalFat: 4.8,
        dietaryFibre: 3.1,
        iron: 1.6,
        calcium: 65,
        sodium: 40,
      },
      per100g: {
        energy: 466,
        protein: 12.0,
        carbohydrate: 68.3,
        totalFat: 16.0,
        dietaryFibre: 10.3,
        iron: 5.3,
        calcium: 216,
        sodium: 133,
      },
    },
    ingredients: [
      'Foxtail Millet Flour',
      'Little Millet Flour',
      'Kodo Millet Flour',
      'Organic Raw Cane Sugar',
      'A2 Cow Ghee',
      'Almond Flakes',
    ],
    allergens: ['Tree Nuts (Almonds)', 'Dairy (Ghee)'],
  },
  {
    name: 'Microgreen Crackers',
    category: 'Cookies',
    price: 190,
    description: 'Savory superfood crackers baked with freshly harvested live sunflower microgreens, sprouted green gram, and roasted sesame seeds.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    sku: 'NHB-MCG-003',
    availability: true,
    isDemoData: true,
    batchNumber: 'NHB-MCG-2026-03',
    storageInstructions: 'Keep in a cool, dry place. Best consumed within 30 days of opening.',
    manufacturingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    bestBeforeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    nutrition: {
      servingSize: '30 g (5 crackers)',
      perServing: {
        energy: 125,
        protein: 4.2,
        carbohydrate: 18.0,
        totalFat: 3.8,
        dietaryFibre: 3.5,
        iron: 2.2,
        calcium: 82,
        sodium: 110,
      },
      per100g: {
        energy: 416,
        protein: 14.0,
        carbohydrate: 60.0,
        totalFat: 12.6,
        dietaryFibre: 11.6,
        iron: 7.3,
        calcium: 273,
        sodium: 366,
      },
    },
    ingredients: [
      'Fresh Sunflower Microgreens',
      'Sprouted Green Gram Flour',
      'Chia Seeds',
      'Flax Seeds',
      'Cold Pressed Sesame Oil',
      'Himalayan Pink Salt',
      'Black Pepper',
    ],
    allergens: ['Sesame'],
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Bread',
    price: 90,
    description: '100% stone-ground whole wheat sourdough loaf naturally fermented for 24 hours. No added preservatives, chemicals, or refined flour.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    sku: 'NHB-BRD-004',
    availability: true,
    isDemoData: true,
    batchNumber: 'NHB-BRD-2026-04',
    storageInstructions: 'Store in a bread box or refrigerator. Consume within 5 days of baking.',
    manufacturingDate: new Date(),
    bestBeforeDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    nutrition: {
      servingSize: '50 g (1 thick slice)',
      perServing: {
        energy: 120,
        protein: 4.5,
        carbohydrate: 23.0,
        totalFat: 1.2,
        dietaryFibre: 3.8,
        iron: 1.4,
        calcium: 35,
        sodium: 160,
      },
      per100g: {
        energy: 240,
        protein: 9.0,
        carbohydrate: 46.0,
        totalFat: 2.4,
        dietaryFibre: 7.6,
        iron: 2.8,
        calcium: 70,
        sodium: 320,
      },
    },
    ingredients: [
      '100% Stone-Ground Whole Wheat Flour',
      'Active Sourdough Starter',
      'Purified Water',
      'Raw Honey',
      'Sea Salt',
    ],
    allergens: ['Wheat (Gluten)'],
  },
  {
    name: 'Healthy Chocolate Cake',
    category: 'Cakes',
    price: 420,
    description: 'Decadent moist chocolate cake made with raw antioxidant-rich cacao, date puree, and cold-pressed avocado oil. 100% refined-sugar free.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    sku: 'NHB-CK-005',
    availability: true,
    isDemoData: true,
    batchNumber: 'NHB-CK-2026-05',
    storageInstructions: 'Refrigerate at 4°C - 8°C. Best served chilled.',
    manufacturingDate: new Date(),
    bestBeforeDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    nutrition: {
      servingSize: '80 g (1 pastry slice)',
      perServing: {
        energy: 210,
        protein: 5.5,
        carbohydrate: 28.0,
        totalFat: 8.5,
        dietaryFibre: 4.2,
        iron: 2.5,
        calcium: 75,
        sodium: 85,
      },
      per100g: {
        energy: 262,
        protein: 6.8,
        carbohydrate: 35.0,
        totalFat: 10.6,
        dietaryFibre: 5.2,
        iron: 3.1,
        calcium: 93,
        sodium: 106,
      },
    },
    ingredients: [
      'Raw Cacao Powder',
      'Spelt Flour',
      'Oat Milk',
      'Medjool Date Puree',
      'Cold Pressed Avocado Oil',
      'Vanilla Bean Extract',
    ],
    allergens: ['Gluten (Spelt)'],
  },
  {
    name: 'Mixed Fruit Dessert',
    category: 'Desserts',
    price: 240,
    description: 'Refreshing probiotic dessert cup layered with wild forest honey, organic chia seed pudding, Greek yogurt, fresh strawberries, and blueberries.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    sku: 'NHB-DST-006',
    availability: true,
    isDemoData: true,
    batchNumber: 'NHB-DST-2026-06',
    storageInstructions: 'Keep refrigerated below 4°C. Consume within 48 hours.',
    manufacturingDate: new Date(),
    bestBeforeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    nutrition: {
      servingSize: '100 g (1 cup)',
      perServing: {
        energy: 145,
        protein: 3.0,
        carbohydrate: 26.0,
        totalFat: 3.2,
        dietaryFibre: 4.5,
        iron: 1.1,
        calcium: 95,
        sodium: 30,
      },
      per100g: {
        energy: 145,
        protein: 3.0,
        carbohydrate: 26.0,
        totalFat: 3.2,
        dietaryFibre: 4.5,
        iron: 1.1,
        calcium: 95,
        sodium: 30,
      },
    },
    ingredients: [
      'Fresh Strawberries',
      'Blueberries',
      'Greek Yogurt',
      'Chia Seeds',
      'Wild Forest Honey',
      'Mint Leaves',
    ],
    allergens: ['Dairy (Greek Yogurt)'],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Cleaning existing data...');
    const adminOnly = process.argv.includes('--admin-only');

    if (!adminOnly) {
      await Product.deleteMany({});
      console.log('[Seed] Products collection cleared.');
    }

    // Upsert Admin user
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nutriheal.com').toLowerCase();
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'NutriHeal Admin',
        email: adminEmail,
        phone: process.env.ADMIN_PHONE || '+919876543210',
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
        role: 'admin',
      });
      console.log(`[Seed] Admin user created: ${admin.email}`);
    } else {
      console.log(`[Seed] Admin user already exists: ${admin.email}`);
    }

    // Upsert Demo Customer
    const customerEmail = 'customer@nutriheal.com';
    let customer = await User.findOne({ email: customerEmail });
    if (!customer) {
      customer = await User.create({
        name: 'Priya Sharma',
        email: customerEmail,
        phone: '+919812345678',
        password: 'User@12345',
        role: 'user',
      });
      console.log(`[Seed] Demo customer created: ${customer.email}`);
    } else {
      console.log(`[Seed] Demo customer already exists: ${customer.email}`);
    }

    if (adminOnly) {
      console.log('[Seed] Admin-only seed complete.');
      process.exit(0);
    }

    // Seed Products with Dynamic QR codes
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    console.log(`[Seed] Generating QR codes mapping to client URL: ${clientUrl}`);

    for (const item of sampleProducts) {
      const slug = slugify(item.name);
      const product = new Product({
        ...item,
        slug,
      });

      // Point QR URL to /product/:id
      const targetUrl = `${clientUrl}/product/${product._id}`;
      product.qrCodeUrl = targetUrl;
      product.qrCodeDataUrl = await generateQRCodeDataUrl(targetUrl);

      await product.save();
      console.log(`[Seed] Product created: "${product.name}" (ID: ${product._id}) -> QR: ${targetUrl}`);
    }

    console.log(`\n✅ [Seed] Successfully seeded ${sampleProducts.length} NutriHeal Bakes products!`);
    console.log('==================================================');
    console.log('Admin Login: admin@nutriheal.com / Admin@12345');
    console.log('User Login:  customer@nutriheal.com / User@12345');
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
