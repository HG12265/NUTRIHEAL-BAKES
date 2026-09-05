import React from 'react';
import { Menu, User, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title, onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            padding: '4px',
          }}
          className="admin-menu-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to="/admin/products/add"
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <PlusCircle size={16} />
          <span className="hide-mobile">Add Product</span>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={16} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'block',
                color: 'var(--text)',
              }}
            >
              {user?.name || 'Administrator'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Super Admin
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-menu-btn {
            display: block !important;
          }
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;
