import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#202A24',
        color: '#FAF4E6',
        padding: '50px 0 30px',
        borderTop: '3px solid var(--primary)',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '36px',
            marginBottom: '40px',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                }}
              >
                <img
                  src="/logo.png"
                  alt="NutriHeal Bakes"
                  style={{
                    height: '46px',
                    width: '46px',
                    borderRadius: '50%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                  <span
                    style={{
                      fontSize: '1.13rem',
                      fontWeight: 900,
                      color: 'black',
                      letterSpacing: '0.02em',
                      display: 'block',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    NUTRIHEAL BAKES
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: 'var(--accent-brown)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginTop: '2px',
                    }}
                  >
                    Healthy Bakes • Smart Nutrition
                  </span>
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#C6D1CA',
                lineHeight: 1.6,
                marginBottom: '16px',
              }}
            >
              "Scan. Know. Choose. Order."
              <br />
              Artisanal healthy baked treats crafted with whole grains, millets, superfoods, and complete nutritional transparency.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                <ShieldCheck size={12} /> 100% Wholesome
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={12} /> Smart QR Tracking
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--highlight-gold)',
                marginBottom: '18px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#D2DDD6', transition: 'color 0.2s' }}>Home Page</Link></li>
              <li><Link to="/products" style={{ color: '#D2DDD6' }}>All Products</Link></li>
              <li><Link to="/scan" style={{ color: '#D2DDD6' }}>Scan Product QR</Link></li>
              <li><Link to="/cart" style={{ color: '#D2DDD6' }}>Shopping Cart</Link></li>
              <li><Link to="/profile" style={{ color: '#D2DDD6' }}>My Account & Orders</Link></li>
              <li><Link to="/admin/login" style={{ color: '#90A398', fontSize: '0.8rem' }}>Admin Portal</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--highlight-gold)',
                marginBottom: '18px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/products?category=Cookies" style={{ color: '#D2DDD6' }}>Millet & Superfood Cookies</Link></li>
              <li><Link to="/products?category=Bread" style={{ color: '#D2DDD6' }}>Whole Wheat & Sourdough Bread</Link></li>
              <li><Link to="/products?category=Cakes" style={{ color: '#D2DDD6' }}>Guilt-Free Healthy Cakes</Link></li>
              <li><Link to="/products?category=Desserts" style={{ color: '#D2DDD6' }}>Probiotic & Fruit Desserts</Link></li>
            </ul>
          </div>

          {/* Nutrition Disclaimer */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--highlight-gold)',
                marginBottom: '18px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Nutrition Transparency
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#A0B1A7', lineHeight: 1.5 }}>
              Every NutriHeal Bakes product package features a unique QR code allowing instant access to verified ingredients, allergens, and dual-mode nutrition metrics (per serving & per 100g).
            </p>
            <div
              style={{
                marginTop: '14px',
                padding: '10px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                borderLeft: '3px solid var(--highlight-gold)',
                fontSize: '0.78rem',
                color: '#C6D1CA',
              }}
            >
              Nutritional values for demo items are simulated. Production batches are verified with lab testing.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.82rem',
            color: '#8A9990',
          }}
        >
          <div>
            © {new Date().getFullYear()} NutriHeal Bakes. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Baked with care <Heart size={14} color="#D34545" fill="#D34545" /> for healthy living.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
