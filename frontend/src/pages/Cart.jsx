import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductImageUrl } from '../utils/imageUrl';

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    totalAmount,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div
          className="card"
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '50px 24px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ShoppingBag size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.5 }}>
            Discover our artisanal whole wheat breads, millet cookies, and guilt-free cakes!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 70px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '28px' }}>
        Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item) => {
            const imageUrl = getProductImageUrl(item.image);

            return (
              <div
                key={item.product}
                className="card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#F5EFE0',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.category || 'Bakery'}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                    <Link
                      to={`/product/${item.product}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {item.name}
                    </Link>
                  </h3>
                  <div style={{ color: 'var(--accent-brown)', fontWeight: 700, fontSize: '1.05rem' }}>
                    ₹{item.price} each
                  </div>
                </div>

                {/* Quantity Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    padding: '2px 4px',
                  }}
                >
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text)',
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>

                  <span
                    style={{
                      width: '32px',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text)',
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Line Total */}
                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    Subtotal
                  </span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--text)' }}>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#C75151',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                  }}
                  title="Remove from cart"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div>
          <div
            className="card"
            style={{
              padding: '28px',
              backgroundColor: '#FFFFFF',
              position: 'sticky',
              top: '90px',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
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

              {subtotal < 500 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--accent-brown)', marginTop: '-4px' }}>
                  💡 Add items worth ₹{500 - subtotal} more for FREE delivery!
                </p>
              )}

              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Amount</span>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--accent-brown)',
                  }}
                >
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-block btn-lg"
              style={{ fontWeight: 700 }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div
              style={{
                marginTop: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={16} color="var(--primary)" />
              Freshly baked & safely packaged
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
