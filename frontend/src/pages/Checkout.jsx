import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>No items in cart to checkout</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Explore Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validations
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      setError('Please complete all required delivery address fields.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i.product,
          productName: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: formData,
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        const orderId = res.data.data._id;
        clearCart();
        addToast('Order placed successfully! We are preparing your fresh bakes.', 'success');
        navigate(`/orders/${orderId}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 70px' }}>
      <Link
        to="/cart"
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
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '28px' }}>
        Checkout & Delivery
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Delivery Address Form */}
        <div className="card" style={{ padding: '32px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Truck size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Delivery Information</h2>
          </div>

          {error && (
            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--danger-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: '0.9rem',
                marginBottom: '20px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Gowtham"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@nutriheal.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <textarea
                name="address"
                required
                className="form-textarea"
                value={formData.address}
                onChange={handleChange}
                placeholder="Apartment, building, street, landmark"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Salem"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  className="form-input"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 560001"
                />
              </div>
            </div>

            {/* Payment Method Notice */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <CheckCircle2 size={24} color="var(--primary)" />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                  Cash / Pay on Delivery (MVP)
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Pay comfortably upon receiving your freshly baked batch.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block btn-lg"
              style={{ fontWeight: 700 }}
            >
              {loading ? 'Placing Order...' : `Place Order • ₹${totalAmount}`}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '18px' }}>
            Your Order ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '20px',
              paddingRight: '4px',
            }}
          >
            {items.map((item) => (
              <div
                key={item.product}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '10px',
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: 'var(--text)' }}>
                    {item.name}
                  </strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Qty: {item.quantity} × ₹{item.price}
                  </span>
                </div>
                <strong style={{ color: 'var(--text)' }}>
                  ₹{item.price * item.quantity}
                </strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>₹{subtotal}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Delivery Fee</span>
              <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'var(--text)', fontWeight: 600 }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Grand Total</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--accent-brown)',
                }}
              >
                ₹{totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
