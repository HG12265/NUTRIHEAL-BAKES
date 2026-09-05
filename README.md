# 🌿 NUTRIHEAL BAKES
> **Tagline**: *"Scan. Know. Choose. Order."*  
> **Aesthetic Theme**: Warm Artisanal Bakery • Pure Ingredients • Complete Nutrition Transparency

---

## 📖 Overview

**NutriHeal Bakes** is a full-stack, production-ready healthy bakery web application. Its primary Unique Selling Proposition (USP) is **instant QR-based product discovery**:
1. Every physical package contains a unique QR code.
2. Customers scan the QR code via mobile camera or browser scanner.
3. The application instantly validates the Product ID and opens the exact product page (`/product/:id`).
4. Customers can view verified nutrition data (dual-mode: *Per Serving* vs *Per 100g*), ingredients, and allergen warnings, and immediately order the product online.

---

## 🎨 Official Brand Palette

| Color Role | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary** | `#6B8E6B` | Nourishing herbal green (Brand identity, main CTAs) |
| **Background** | `#FFF8E7` | Warm creamy bakery vanilla canvas |
| **Accent Brown** | `#8B5E3C` | Freshly baked artisanal crust & headings |
| **Highlight Gold** | `#D9A441` | Golden grain highlight & QR CTA |
| **Text** | `#26332B` | Earthy deep slate-green text |

---

## 🛠️ Technology Stack

- **Frontend**:
  - React.js + Vite
  - React Router DOM v7
  - Axios (centralized `api.js` client with JWT interceptor)
  - HTML5-QRCode (high-speed camera & image scanner)
  - Lucide React (modern, lightweight icons)
  - Context API (`AuthContext`, `CartContext`, `ToastContext`)
  - Modern Vanilla CSS design system (`index.css`)

- **Backend**:
  - Node.js & Express.js (REST architecture)
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (JWT) & bcryptjs for password encryption
  - QRCode generation library (dynamic data URL & PNG buffer streaming)
  - Multer for local product image uploads
  - CORS, Dotenv, and centralized error handling middleware

---

## 📁 Project Structure

```
c:/Users/Gowtham/Desktop/NUTRIHEAL BAKES/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   ├── adminController.js    # Dashboard stats, user listing
│   │   │   ├── authController.js     # Register, login, profile, password
│   │   │   ├── orderController.js    # Create order, user orders, admin status update
│   │   │   └── productController.js  # CRUD, availability, QR generation, download
│   │   ├── middleware/
│   │   │   ├── auth.js               # authenticateUser & authorizeAdmin JWT guards
│   │   │   ├── error.js              # Centralized error handler
│   │   │   └── upload.js             # Multer image storage & type filter
│   │   ├── models/
│   │   │   ├── Order.js              # Order & shipping schema
│   │   │   ├── Product.js            # Product schema with dual-mode nutrition & QR
│   │   │   └── User.js               # User schema with roles (user, admin)
│   │   ├── routes/
│   │   │   ├── adminRoutes.js        # /api/admin/*
│   │   │   ├── authRoutes.js         # /api/auth/*
│   │   │   ├── orderRoutes.js        # /api/orders/*
│   │   │   └── productRoutes.js      # /api/products/*
│   │   ├── utils/
│   │   │   ├── qrGenerator.js        # Base64 data URL & PNG buffer generator
│   │   │   └── slugify.js            # SEO-friendly URL slug generator
│   │   ├── app.js                    # Express app configuration & middlewares
│   │   ├── server.js                 # Server entry point (port 5000)
│   │   └── seed.js                   # Seed script with 6 sample products + admin/customer
│   ├── uploads/
│   │   └── products/                 # Uploaded product images
│   ├── .env                          # Environment variables
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                # AdminSidebar, AdminHeader
│   │   │   ├── common/               # Navbar, MobileBottomNav, Footer, Toast, Loaders
│   │   │   ├── nutrition/            # NutrientMetricCard
│   │   │   ├── product/              # ProductCard, ProductGrid
│   │   │   └── scanner/              # QRScanner (camera preview, laser animation, fallbacks)
│   │   ├── context/                  # AuthContext, CartContext, ToastContext
│   │   ├── pages/
│   │   │   ├── admin/                # AdminLogin, Dashboard, Products, ProductForm, QRCodes, Orders, Users
│   │   │   ├── Home.jsx              # Hero, prominent QR scanner CTA, categories, featured
│   │   │   ├── Products.jsx          # Catalog with category filters & debounced search
│   │   │   ├── ProductDetails.jsx    # Complete product specs, preview nutrition, add to cart
│   │   │   ├── NutritionDashboard.jsx# Dual-mode (Per Serving vs Per 100g) metric cards
│   │   │   ├── Scan.jsx              # Dedicated mobile-first QR scanner page
│   │   │   ├── Cart.jsx              # Shopping cart with delivery breakdown
│   │   │   ├── Checkout.jsx          # Shipping address form & cash-on-delivery
│   │   │   ├── Orders.jsx            # Order history with status badges
│   │   │   ├── OrderDetails.jsx      # Order invoice receipt
│   │   │   ├── Login.jsx             # Customer login
│   │   │   ├── Register.jsx          # Customer registration
│   │   │   └── Profile.jsx           # Account management & password update
│   │   ├── routes/                   # ProtectedRoute, AdminRoute
│   │   ├── services/                 # api.js Axios centralized configuration
│   │   ├── App.jsx                   # React Router route registry
│   │   ├── index.css                 # Brand design system, tokens, and utilities
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json                      # Convenient workspace runner scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **MongoDB**: Active instance running on port 27017 (`mongodb://127.0.0.1:27017`)

---

### Step 1: Install Dependencies

```bash
# In project root:
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 2: Environment Configuration

Backend configuration in `backend/.env`:
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/nutriheal_bakes
JWT_SECRET=nutriheal_super_secret_jwt_key_2026_change_in_production
CLIENT_URL=http://localhost:5173
ADMIN_NAME=NutriHeal Admin
ADMIN_EMAIL=admin@nutriheal.com
ADMIN_PASSWORD=Admin@12345
ADMIN_PHONE=+919876543210
```

---

### Step 3: Seed Sample Products & Accounts

Run the database seed script to populate sample healthy bakery items and default accounts:

```bash
cd backend
npm run seed
```

This seeds:
- 6 Handcrafted Bakery Products (Ragi Jaggery Cookies, Multimillet Cookies, Microgreen Crackers, Whole Wheat Bread, Healthy Chocolate Cake, Mixed Fruit Dessert) with full nutrition metrics, ingredients, allergens, batch numbers, and generated QR codes.
- **Admin Account**: `admin@nutriheal.com` / `Admin@12345`
- **Customer Account**: `customer@nutriheal.com` / `User@12345`

---

### Step 4: Run the Application

In two separate terminals:

```bash
# Terminal 1: Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (Port 5173)
cd frontend
npm run dev
```

Or from the workspace root:
```bash
npm run dev:backend
npm run dev:frontend
```

Now open: **http://localhost:5173**

---

## 🔑 Default Credentials

| Portal | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Customer Storefront** | User | `customer@nutriheal.com` | `User@12345` |
| **Admin Portal** (`/admin/login`) | Administrator | `admin@nutriheal.com` | `Admin@12345` |

---

## 📱 Core Features

### 1. QR-Based Product Discovery (Core USP)
- Accessible on `/scan` or via the prominent hero CTA on the Home page.
- Utilizes device camera with reticle framing and animated laser line.
- Securely extracts Product ID from scanned URL and queries `GET /api/products/:id`.
- Automatically redirects to `/product/:id` upon detection.
- Includes quick-test simulator buttons and QR file upload options for desktop/camera-less environments.

### 2. Dual-Mode Nutrition Dashboard
- Accessible on `/nutrition/:productId`.
- Toggle between **Per Serving** and **Per 100g** views.
- Displays 8 clean visual nutrition metric cards: Energy, Protein, Carbohydrate, Total Fat, Dietary Fibre, Iron, Calcium, Sodium.
- Dynamic ingredient badges and allergen advisories (only displayed if present in product formulation).

### 3. Shopping Cart & Cash-on-Delivery Checkout
- Add to cart with quantity stepper, persistence across sessions.
- Delivery calculation: Free delivery on orders ≥ ₹500, else ₹40 standard fee.
- Streamlined checkout with shipping address form and order invoice generation (`/orders/:id`).

### 4. Comprehensive Admin Center
- **Dashboard** (`/admin/dashboard`): 5 summary cards, recent orders table, and recent products list.
- **Product Management** (`/admin/products`): 6-section product form, stock availability toggle, image upload, delete confirmation.
- **QR Code Center** (`/admin/qr-codes`): Preview QR codes, download high-res PNGs, and print batch packaging stickers.
- **Order Management** (`/admin/orders`): Status filter tabs (Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled) with immediate status update.
- **User Directory** (`/admin/users`): Registered customer and administrator listing.

---

## 🔒 Security Best Practices Implemented
- Passwords hashed using `bcryptjs` with salt rounds.
- Passwords stripped (`select: false`) by default from queries.
- Strict JWT authentication on customer and admin endpoints.
- Role-based authorization middleware (`authorizeAdmin`) rejecting unauthorized access with `403 Forbidden`.
- QR scanner validates data as untrusted input and prevents arbitrary code execution.
- File upload restrictions: maximum 5MB, strictly `image/jpeg`, `image/png`, and `image/webp`.

---

## 🧪 Automated Testing

Run the full end-to-end integration test suite:

```bash
cd backend
node test-full-e2e.js
```
