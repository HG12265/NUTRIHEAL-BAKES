import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Zap,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  Package,
  Clock,
  Plus,
  Minus,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
          document.title = `${res.data.data.name} | NutriHeal Bakes`;
        }
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={36} message="Loading wholesome product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div
          className="card"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '40px 24px',
          }}
        >
          <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            {error || 'The requested product could not be located in our database.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/products" className="btn btn-primary">
              Browse All Products
            </Link>
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : product.image?.startsWith('/')
    ? `http://localhost:5000${product.image}`
    : 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = () => {
    if (product.availability) {
      addToCart(product, quantity);
    }
  };

  const handleOrderNow = () => {
    if (product.availability) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const nutrition = product.nutrition?.perServing || {};

  return (
    <div className="container" style={{ padding: '30px 20px 60px' }}>
      {/* Back Link */}
      <Link
        to="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      {/* Main Grid: Left Image & Right Purchase Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}
      >
        {/* Product Image & QR Preview Card */}
        <div>
          <div
            className="card"
            style={{
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              position: 'relative',
              borderRadius: '24px',
            }}
          >
            <div style={{ height: '380px', backgroundColor: '#F6F0E3', overflow: 'hidden' }}>
              <img
                src={imageUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* In-Stock / Out of Stock Banner */}
            <div
              style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <span className="badge badge-gold">{product.category}</span>
              <span
                className={`badge ${product.availability ? 'badge-success' : 'badge-danger'}`}
              >
                {product.availability ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details & Ordering Form */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--accent-brown)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}
          >
            NutriHeal Bakes • SKU: {product.sku || 'NHB-PKG'}
          </span>

          <h1
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '14px',
              color: 'var(--text)',
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--accent-brown)',
              }}
            >
              ₹{product.price}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Inclusive of all taxes
            </span>
          </div>

          {/* Serving Size Highlight */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              marginBottom: '20px',
              alignSelf: 'flex-start',
            }}
          >
            <Package size={16} /> Serving Size: {product.nutrition?.servingSize || '30 g'}
          </div>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            {product.description}
          </p>

          {/* Quantity Selector & Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {/* Quantity Stepper */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                backgroundColor: '#FFFFFF',
                padding: '4px',
              }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || !product.availability}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text)',
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>

              <span
                style={{
                  width: '40px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                disabled={!product.availability}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text)',
                }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.availability}
              className={`btn btn-lg ${product.availability ? 'btn-primary' : 'btn-disabled'}`}
              style={{ flex: 1, minWidth: '150px' }}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            {/* Order Now Button */}
            <button
              onClick={handleOrderNow}
              disabled={!product.availability}
              className={`btn btn-lg ${product.availability ? 'btn-gold' : 'btn-disabled'}`}
              style={{ flex: 1, minWidth: '150px' }}
            >
              <Zap size={18} />
              Order Now
            </button>
          </div>

          {/* Safe Batch Meta */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
            }}
          >
            <div>
              <span style={{ display: 'block', fontWeight: 600 }}>Batch Number</span>
              <strong style={{ color: 'var(--text)' }}>{product.batchNumber || 'NHB-2026-01'}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontWeight: 600 }}>Best Before</span>
              <strong style={{ color: 'var(--text)' }}>
                {product.bestBeforeDate
                  ? new Date(product.bestBeforeDate).toLocaleDateString()
                  : '45 days from mfg'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NUTRITION PREVIEW & PROMINENT NUTRITION DASHBOARD CTA */}
      <section
        className="card"
        style={{
          padding: '30px',
          backgroundColor: '#FFFFFF',
          marginBottom: '36px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
              Transparency First
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              Nutrition Overview{' '}
              <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                (Per Serving: {product.nutrition?.servingSize || '30 g'})
              </span>
            </h2>
          </div>

          {/* Prominent View Full Nutrition Dashboard CTA Button */}
          <Link
            to={`/nutrition/${product._id}`}
            className="btn btn-gold btn-md"
            style={{ fontWeight: 700, gap: '8px' }}
          >
            <Sparkles size={18} />
            View Full Nutrition Dashboard
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Quick Nutrition Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '14px',
          }}
        >
          {[
            { label: 'Energy', val: `${nutrition.energy ?? 0} kcal` },
            { label: 'Protein', val: `${nutrition.protein ?? 0} g` },
            { label: 'Carbs', val: `${nutrition.carbohydrate ?? 0} g` },
            { label: 'Total Fat', val: `${nutrition.totalFat ?? 0} g` },
            { label: 'Fibre', val: `${nutrition.dietaryFibre ?? 0} g` },
            { label: 'Iron', val: `${nutrition.iron ?? 0} mg` },
            { label: 'Calcium', val: `${nutrition.calcium ?? 0} mg` },
            { label: 'Sodium', val: `${nutrition.sodium ?? 0} mg` },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: '14px 10px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg)',
                textAlign: 'center',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                {item.label}
              </span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text)', marginTop: '4px', display: 'block' }}>
                {item.val}
              </strong>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INGREDIENTS & ALLERGENS SECTION */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Ingredients Card */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px' }}>
            Ingredients
          </h3>
          {product.ingredients && product.ingredients.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--text)',
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No custom ingredients listed.
            </p>
          )}

          <div style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Storage Instructions:</strong> {product.storageInstructions || 'Store in an airtight container.'}
          </div>
        </div>

        {/* Allergen Information Card */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px' }}>
            Allergen Information
          </h3>

          {product.allergens && product.allergens.length > 0 ? (
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--danger-light)',
                borderRadius: '12px',
                border: '1px solid rgba(211, 69, 69, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldAlert size={18} color="var(--danger)" />
                <strong style={{ color: 'var(--danger)', fontSize: '0.95rem' }}>
                  Contains the following allergens:
                </strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {product.allergens.map((alg, idx) => (
                  <span
                    key={idx}
                    className="badge badge-danger"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    {alg}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--success-light)',
                borderRadius: '12px',
                border: '1px solid rgba(62, 142, 65, 0.25)',
                color: 'var(--success)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              ✓ No common allergens present in this product formulation.
            </div>
          )}

          <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Baked in a dedicated facility prioritizing natural wholesome ingredients. Always review allergen badges prior to consumption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
