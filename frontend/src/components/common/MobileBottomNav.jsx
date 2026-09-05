import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, QrCode, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const MobileBottomNav = () => {
  const { totalItems } = useCart();

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '68px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 990,
        boxShadow: '0 -4px 16px rgba(38, 51, 43, 0.08)',
        padding: '0 8px',
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: 600,
          textDecoration: 'none',
        })}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/products"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: 600,
          textDecoration: 'none',
        })}
      >
        <ShoppingBag size={20} />
        <span>Products</span>
      </NavLink>

      {/* Prominent Elevated QR Scan Center Button */}
      <NavLink
        to="/scan"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textDecoration: 'none',
          position: 'relative',
          top: '-16px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            background: 'linear-gradient(135deg, #6B8E6B, #4D6E4D)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 6px 16px rgba(107, 142, 107, 0.5)',
            border: '4px solid #FFFFFF',
            transition: 'transform 0.15s ease',
          }}
        >
          <QrCode size={26} />
        </div>
        <span
          style={{
            color: 'var(--primary)',
            fontSize: '0.72rem',
            fontWeight: 700,
            marginTop: '2px',
          }}
        >
          Scan QR
        </span>
      </NavLink>

      <NavLink
        to="/cart"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: 600,
          textDecoration: 'none',
          position: 'relative',
        })}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-8px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {totalItems}
            </span>
          )}
        </div>
        <span>Cart</span>
      </NavLink>

      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: 600,
          textDecoration: 'none',
        })}
      >
        <User size={20} />
        <span>Profile</span>
      </NavLink>

      <style>{`
        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileBottomNav;
