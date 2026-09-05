import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Calendar, MapPin, Package, Clock, ShieldCheck } from 'lucide-react';
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

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={36} message="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '460px', margin: '0 auto', padding: '40px 24px' }}>
          <h2>Order Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '14px 0 24px' }}>{error}</p>
          <Link to="/orders" className="btn btn-primary">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 70px', maxWidth: '850px' }}>
      <Link
        to="/orders"
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
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      {/* Success Notification Header */}
      <div
        style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: 'var(--success-light)',
          border: '1px solid rgba(62, 142, 65, 0.3)',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <CheckCircle2 size={36} color="var(--success)" style={{ flexShrink: 0 }} />
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--success)', marginBottom: '4px' }}>
            Order Placed Successfully!
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
            Thank you for choosing NutriHeal Bakes. Your healthy batch is being freshly prepared!
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '32px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Order Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '20px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>#{order._id}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
              Current Status
            </span>
            <span
              className={`badge ${getStatusBadgeClass(order.status)}`}
              style={{ fontSize: '0.9rem', padding: '6px 14px', marginTop: '4px' }}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Ordered Items */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
            Items in this Order
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                    {item.productName}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × ₹{item.price}
                  </span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--accent-brown)' }}>
                  ₹{item.subtotal}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Summary Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '20px',
          }}
        >
          {/* Shipping Address */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="var(--primary)" /> Delivery Address
            </h4>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text)', display: 'block' }}>
                {order.shippingAddress.fullName}
              </strong>
              <div>{order.shippingAddress.address}</div>
              <div>{order.shippingAddress.city} - {order.shippingAddress.pincode}</div>
              <div>Phone: {order.shippingAddress.phone}</div>
              <div>Email: {order.shippingAddress.email}</div>
            </div>
          </div>

          {/* Pricing Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text)' }}>₹{order.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Delivery Fee</span>
              <span style={{ color: order.deliveryFee === 0 ? 'var(--success)' : 'var(--text)' }}>
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <strong style={{ fontSize: '1.1rem' }}>Total Paid</strong>
              <strong
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--accent-brown)',
                }}
              >
                ₹{order.totalAmount}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
