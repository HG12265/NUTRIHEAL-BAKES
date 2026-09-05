import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { QrCode, ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Official Brand Logo: Diagram Emblem on left, typography on right */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
          title="NutriHeal Bakes - Healthy Bakes • Smart Nutrition"
        >
          {/* Official Brand Circular Logo */}
          <img
            src="/logo.png"
            alt="NutriHeal Bakes Logo"
            style={{
              height: '50px',
              width: '50px',
              borderRadius: '50%',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          />

          {/* NUTRIHEAL BAKES Text on the side */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span
              style={{
                fontSize: '1.28rem',
                fontWeight: 900,
                color: 'var(--primary-dark)',
                letterSpacing: '0.03em',
                display: 'block',
                fontFamily: 'var(--font-heading)',
              }}
            >
              NUTRIHEAL BAKES
            </span>
            <span
              style={{
                fontSize: '0.72rem',
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
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? 'var(--primary)' : 'var(--text)',
              transition: 'var(--transition)',
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? 'var(--primary)' : 'var(--text)',
              transition: 'var(--transition)',
            })}
          >
            Products
          </NavLink>

          {/* Prominent QR Scan Link */}
          <NavLink
            to="/scan"
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isActive
                ? 'var(--highlight-gold)'
                : 'var(--highlight-gold-light)',
              color: '#4B370B',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: '1px solid rgba(217, 164, 65, 0.4)',
              transition: 'var(--transition)',
            })}
          >
            <QrCode size={16} color="#8C6212" />
            Scan QR
          </NavLink>

          <NavLink
            to="/cart"
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? 'var(--primary)' : 'var(--text)',
              position: 'relative',
              padding: '6px 8px',
            })}
          >
            <ShoppingCart size={20} />
            Cart
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalItems}
              </span>
            )}
          </NavLink>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <NavLink
                to="/profile"
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: isActive ? 'var(--primary)' : 'var(--text)',
                })}
              >
                <User size={18} />
                Profile
              </NavLink>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="btn btn-outline btn-sm"
                  style={{ gap: '4px' }}
                >
                  <Shield size={14} />
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  padding: '6px',
                }}
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
