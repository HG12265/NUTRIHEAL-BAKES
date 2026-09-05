import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'badge-success';
    case 'Cancelled':
      return 'badge-danger';
    case 'Preparing':
    case 'Out for Delivery':
      return 'badge-gold';
    default:
      return 'badge-primary';
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={36} message="Loading your orders..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '460px', margin: '0 auto', padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
          <Package size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>No orders yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            You haven't placed any healthy bakery orders yet.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 70px', maxWidth: '850px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '28px' }}>
        My Orders ({orders.length})
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {orders.map((order) => (
          <div
            key={order._id}
            className="card"
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '14px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                  Order ID
                </span>
                <strong style={{ fontSize: '0.95rem' }}>#{order._id.slice(-8).toUpperCase()}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Calendar size={15} />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Order Items Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    color: 'var(--text)',
                  }}
                >
                  <span>
                    {item.productName} <strong style={{ color: 'var(--text-muted)' }}>× {item.quantity}</strong>
                  </span>
                  <span>₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-light)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                  Total Amount
                </span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-brown)' }}>
                  ₹{order.totalAmount}
                </strong>
              </div>

              <Link
                to={`/orders/${order._id}`}
                className="btn btn-outline btn-sm"
                style={{ gap: '4px' }}
              >
                View Order Details <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
