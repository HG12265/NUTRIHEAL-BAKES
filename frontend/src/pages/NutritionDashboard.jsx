import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Info,
  Package,
  Calendar,
  Layers,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { NutrientMetricCard } from '../components/nutrition/NutritionCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const NutritionDashboard = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('perServing'); // 'perServing' or 'per100g'

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${productId}`);
        if (res.data.success) {
          setProduct(res.data.data);
          document.title = `${res.data.data.name} - Nutrition Dashboard | NutriHeal Bakes`;
        }
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={36} message="Generating clean Nutrition Dashboard..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '36px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Nutrition Data Unavailable</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const nutritionData =
    mode === 'perServing'
      ? product.nutrition?.perServing || {}
      : product.nutrition?.per100g || {};

  const handleOrderNow = () => {
    if (product.availability) {
      addToCart(product, 1);
      navigate('/checkout');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 70px', maxWidth: '1000px' }}>
      {/* Top Header & Back Link */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <Link
          to={`/product/${product._id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} /> Back to {product.name}
        </Link>

        {/* Mode Toggle Switch: Per Serving vs Per 100g */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <button
            onClick={() => setMode('perServing')}
            className={`btn btn-sm ${mode === 'perServing' ? 'btn-primary' : ''}`}
            style={{
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: mode === 'perServing' ? 'var(--primary)' : 'transparent',
              color: mode === 'perServing' ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            Per Serving ({product.nutrition?.servingSize || '30g'})
          </button>

          <button
            onClick={() => setMode('per100g')}
            className={`btn btn-sm ${mode === 'per100g' ? 'btn-primary' : ''}`}
            style={{
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: mode === 'per100g' ? 'var(--primary)' : 'transparent',
              color: mode === 'per100g' ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            Per 100g
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div
        className="card"
        style={{
          padding: '30px',
          backgroundColor: '#FFFFFF',
          marginBottom: '32px',
          borderLeft: '5px solid var(--primary)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
              {product.category} • Transparent Lab Breakdown
            </span>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>
              {product.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Displaying verified nutritional breakdown calculated{' '}
              <strong>
                {mode === 'perServing'
                  ? `per serving of ${product.nutrition?.servingSize || '30g'}`
                  : 'per 100 grams'}
              </strong>
              .
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
              Price
            </span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--accent-brown)',
              }}
            >
              ₹{product.price}
            </span>
          </div>
        </div>
      </div>

      {/* 8 Clean Visual Nutrition Cards */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '18px' }}>
          Macronutrient & Mineral Breakdown
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
          }}
        >
          <NutrientMetricCard metricKey="energy" value={nutritionData.energy} />
          <NutrientMetricCard metricKey="protein" value={nutritionData.protein} />
          <NutrientMetricCard metricKey="carbohydrate" value={nutritionData.carbohydrate} />
          <NutrientMetricCard metricKey="totalFat" value={nutritionData.totalFat} />
          <NutrientMetricCard metricKey="dietaryFibre" value={nutritionData.dietaryFibre} />
          <NutrientMetricCard metricKey="iron" value={nutritionData.iron} />
          <NutrientMetricCard metricKey="calcium" value={nutritionData.calcium} />
          <NutrientMetricCard metricKey="sodium" value={nutritionData.sodium} />
        </div>
      </div>

      {/* Ingredients & Allergens Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Ingredients */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>
            Formulation Ingredients
          </h3>
          {product.ingredients && product.ingredients.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.ingredients.map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-subtle)',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No ingredients recorded.
            </p>
          )}
        </div>

        {/* Allergen Information */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>
            Allergen Advisory
          </h3>
          {product.allergens && product.allergens.length > 0 ? (
            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--danger-light)',
                borderRadius: '12px',
                border: '1px solid rgba(211, 69, 69, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldAlert size={18} color="var(--danger)" />
                <strong style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>
                  Product contains:
                </strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {product.allergens.map((alg, idx) => (
                  <span key={idx} className="badge badge-danger">
                    {alg}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--success-light)',
                borderRadius: '12px',
                border: '1px solid rgba(62, 142, 65, 0.25)',
                color: 'var(--success)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              ✓ No common allergens present in this product.
            </div>
          )}
        </div>
      </div>

      {/* Lab Verification Note */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px dashed var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}
      >
        <Info size={20} color="var(--accent-brown)" style={{ flexShrink: 0 }} />
        <div>
          NutriHeal Bakes verified batch report: Batch{' '}
          <strong style={{ color: 'var(--text)' }}>{product.batchNumber || 'NHB-2026-01'}</strong>.
          Values reflect strict nutrient retention standards.
        </div>
      </div>

      {/* Bottom Actions: Back to Product & Order Now */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <Link
          to={`/product/${product._id}`}
          className="btn btn-outline btn-lg"
          style={{ minWidth: '180px' }}
        >
          <ArrowLeft size={18} />
          Back to Product
        </Link>

        <button
          onClick={handleOrderNow}
          disabled={!product.availability}
          className={`btn btn-lg ${product.availability ? 'btn-primary' : 'btn-disabled'}`}
          style={{ minWidth: '180px' }}
        >
          <Zap size={18} />
          Order Now
        </button>
      </div>
    </div>
  );
};

export default NutritionDashboard;
