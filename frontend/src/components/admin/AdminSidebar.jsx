import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  QrCode,
  Package,
  Users,
  LogOut,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'QR Codes', path: '/admin/qr-codes', icon: QrCode },
    { label: 'Orders', path: '/admin/orders', icon: Package },
    { label: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 998,
          }}
          className="admin-sidebar-backdrop"
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#1E2822',
          color: '#EBF2ED',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Brand Banner */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src="/logo-icon.png"
            alt="NutriHeal Bakes"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              padding: '3px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                color: '#FFFFFF',
                fontWeight: 800,
                letterSpacing: '-0.01em',
              }}
            >
              NUTRIHEAL
            </h2>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--highlight-gold)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Admin Center
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flex: 1,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? '#FFFFFF' : '#9EAFA5',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  transition: 'var(--transition)',
                  textDecoration: 'none',
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#D4E2D8',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={16} /> View Storefront
            </span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#F48E8E',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'var(--transition)',
            }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
