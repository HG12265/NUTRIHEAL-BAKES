import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, ArrowRight, Sparkles } from 'lucide-react';
import { useAdminNotification } from '../../context/AdminNotificationContext';

const OrderAlertToast = () => {
  const { activeToast, dismissToast } = useAdminNotification();
  const navigate = useNavigate();

  if (!activeToast) return null;

  const { orderData, title, message } = activeToast;
  const orderId = orderData?.orderId || activeToast.order;
  const customerName = orderData?.customerName || 'A customer';
  const totalAmount = orderData?.totalAmount;
  const itemsCount = orderData?.itemsCount;

  const handleViewOrder = () => {
    dismissToast();
    navigate('/admin/orders');
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: '84px',
        right: '24px',
        zIndex: 9999,
        maxWidth: '420px',
        width: 'calc(100% - 48px)',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(78, 140, 93, 0.25)',
        borderLeft: '5px solid var(--primary)',
        overflow: 'hidden',
        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          padding: '16px 18px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F7FAF7',
          borderBottom: '1px solid #E8EFE9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              boxShadow: '0 0 12px rgba(78, 140, 93, 0.4)',
              animation: 'pulse 1.5s infinite',
            }}
          >
            <ShoppingBag size={15} />
          </span>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--primary-dark)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {title || 'New Order Received!'}
          </span>
        </div>

        <button
          onClick={dismissToast}
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Body content */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>
            {customerName}
          </span>
          {totalAmount != null && (
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--primary)',
              }}
            >
              ₹{totalAmount}
            </span>
          )}
        </div>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginBottom: '14px',
          }}
        >
          {message || 'A fresh bake order was placed and awaits confirmation.'}
          {itemsCount != null && (
            <span style={{ display: 'block', fontSize: '0.78rem', marginTop: '4px', color: 'var(--primary)' }}>
              📦 {itemsCount} fresh bakery {itemsCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </p>

        {/* Action row */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleViewOrder}
            className="btn btn-primary btn-sm"
            style={{
              flex: 1,
              justifyContent: 'center',
              fontWeight: 700,
              gap: '6px',
              padding: '9px 14px',
            }}
          >
            <span>View Order Details</span>
            <ArrowRight size={15} />
          </button>
          <button
            onClick={dismissToast}
            className="btn btn-outline btn-sm"
            style={{
              padding: '9px 14px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Progress auto-dismiss bar */}
      <div
        style={{
          height: '4px',
          backgroundColor: '#EAEAEA',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: 'var(--primary)',
            animation: 'toastCountdown 8s linear forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toastCountdown {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderAlertToast;
