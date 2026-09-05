import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Leaf,
  ChevronRight,
  PackageCheck,
  Award,
} from 'lucide-react';
import api from '../services/api';
import ProductGrid from '../components/product/ProductGrid';

const categories = [
  {
    name: 'Cookies',
    title: 'Millet & Superfood Cookies',
    desc: 'Crispy, fiber-rich treats baked with ragi, foxtail & jaggery.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bread',
    title: 'Stone-Ground Sourdough & Breads',
    desc: 'Slow-fermented whole grain bread without artificial additives.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cakes',
    title: 'Guilt-Free Cakes',
    desc: 'Decadent bakes sweetened with dates & raw cacao.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Desserts',
    title: 'Probiotic Parfaits & Desserts',
    desc: 'Fresh fruit layered cups with chia pudding & raw forest honey.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          setFeaturedProducts(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.warn('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '40px' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F5EFE0 0%, var(--bg) 100%)',
          padding: '60px 0 40px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Hero Left Copy */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  marginBottom: '18px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                <Leaf size={14} /> 100% Wholesome Healthy Bakery
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.3rem, 4vw, 3.4rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '20px',
                  color: 'var(--text)',
                }}
              >
                Healthy Bakes.{' '}
                <span style={{ color: 'var(--primary)' }}>Smart Nutrition.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '520px',
                }}
              >
                Scan your product to instantly discover its ingredients, nutrition, and complete batch details. Artisanal healthy baking made completely transparent.
              </p>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <Link
                  to="/scan"
                  className="btn btn-gold btn-lg"
                  style={{
                    boxShadow: '0 6px 20px rgba(217, 164, 65, 0.45)',
                    fontWeight: 700,
                  }}
                >
                  <QrCode size={22} />
                  Scan Your Product
                </Link>

                <Link to="/products" className="btn btn-outline-brown btn-lg">
                  Explore Products
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Trust Badges */}
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '36px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={18} color="var(--primary)" /> Zero Refined Sugar
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HeartPulse size={18} color="var(--accent-brown)" /> Diabetic-Friendly
                </div>
              </div>
            </div>

            {/* Hero Right Visual: PROMINENT QR SCANNING USP CARD */}
            <div>
              <div
                className="card"
                style={{
                  padding: '36px 28px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid var(--primary)',
                  boxShadow: 'var(--shadow-xl)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--highlight-gold-light)',
                    opacity: 0.6,
                    zIndex: 0,
                  }}
                />

                <span
                  className="badge badge-gold"
                  style={{
                    marginBottom: '16px',
                    position: 'relative',
                    zIndex: 1,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                  }}
                >
                  <Sparkles size={14} /> Primary Feature
                </span>

                <h3
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    marginBottom: '12px',
                    color: 'var(--text)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  SCAN YOUR PRODUCT
                </h3>

                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                    marginBottom: '24px',
                    lineHeight: 1.5,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Scan the QR code on your NutriHeal Bakes package to instantly view verified nutrition, ingredients, and allergen breakdown.
                </p>

                {/* Animated QR Graphic */}
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 24px',
                    padding: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: '16px',
                    border: '2px dashed var(--highlight-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <QrCode size={110} color="var(--primary)" />
                  <div className="scanner-laser" />
                </div>

                <Link
                  to="/scan"
                  className="btn btn-primary btn-block btn-lg"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    fontWeight: 700,
                    fontSize: '1.05rem',
                  }}
                >
                  <QrCode size={20} />
                  SCAN QR CODE NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. USP SECTION: SCAN. KNOW. CHOOSE. ORDER. */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <span
            className="badge badge-primary"
            style={{ marginBottom: '10px' }}
          >
            How NutriHeal Works
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            SCAN. KNOW. CHOOSE. ORDER.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>
            Empowering every customer with 100% transparent bakery nutrition.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            {
              step: '01',
              title: 'SCAN',
              desc: 'Point your camera at the QR code printed on any NutriHeal Bakes packet.',
              icon: QrCode,
              color: 'var(--primary)',
              bg: 'var(--primary-light)',
            },
            {
              step: '02',
              title: 'KNOW',
              desc: 'Instantly view verified ingredients, allergens, and dual-mode nutrition metrics.',
              icon: Sparkles,
              color: 'var(--highlight-gold)',
              bg: 'var(--highlight-gold-light)',
            },
            {
              step: '03',
              title: 'CHOOSE',
              desc: 'Make smart, informed dietary choices aligned with your wellness goals.',
              icon: Award,
              color: 'var(--accent-brown)',
              bg: 'var(--accent-brown-light)',
            },
            {
              step: '04',
              title: 'ORDER',
              desc: 'Re-order your favorite freshly baked healthy treats online for direct doorstep delivery.',
              icon: PackageCheck,
              color: '#3E8E41',
              bg: '#E8F5E9',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="card"
                style={{
                  padding: '28px 24px',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '18px',
                    right: '20px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: 'rgba(38, 51, 43, 0.08)',
                  }}
                >
                  {item.step}
                </div>

                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                  }}
                >
                  <Icon size={24} />
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: 800 }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '8px' }}>
              Fresh From Our Ovens
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Curated Healthy Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="btn btn-outline btn-sm"
            style={{ gap: '4px' }}
          >
            View All Categories <ChevronRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit',
                overflow: 'hidden',
              }}
            >
              <div style={{ height: '170px', overflow: 'hidden' }}>
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.35s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>
                  {cat.desc}
                </p>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Explore {cat.name} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (DYNAMIC FROM MONGODB) */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
              Handcrafted Favorites
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Featured Healthy Bakes
            </h2>
          </div>
          <Link to="/products" className="btn btn-outline-brown btn-sm">
            View All Products
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* 5. WHY NUTRIHEAL BAKES */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '60px 0',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
              Our Philosophy
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              Why NutriHeal Bakes?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>
              We believe food should nourish, heal, and energize your life without compromise on flavor.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
            }}
          >
            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--accent-brown)' }}>
                🌾 Ancient Indian Millets
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Harnessing Ragi, Foxtail, Kodo, and Little millets packed with slow-digesting dietary fiber, natural iron, and calcium.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--accent-brown)' }}>
                🌱 Live Microgreens & Seeds
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Freshly sprouted greens, chia, flax, and sesame seeds loaded with cellular antioxidants, plant proteins, and healthy fatty acids.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--accent-brown)' }}>
                🔍 Complete QR Traceability
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                No hidden chemicals, no vague labels. Scan any package to view exact lab-mode nutrition and transparent allergen declarations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #446144, #26332B)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '50px 36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: '16px',
            }}
          >
            Ready to Taste the NutriHeal Difference?
          </h2>
          <p
            style={{
              color: '#E0ECE4',
              fontSize: '1.05rem',
              maxWidth: '560px',
              margin: '0 auto 30px',
              lineHeight: 1.6,
            }}
          >
            Have a NutriHeal Bakes box in your hand? Scan the QR code now, or browse our wholesome product lineup!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/scan" className="btn btn-gold btn-lg">
              <QrCode size={20} />
              Scan QR Code
            </Link>
            <Link
              to="/products"
              className="btn btn-outline btn-lg"
              style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
