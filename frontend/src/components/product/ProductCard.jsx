import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, QrCode } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getProductImageUrl } from '../../utils/imageUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.availability) {
      addToCart(product, 1);
    }
  };

  // Image handling
  const imageUrl = getProductImageUrl(product.image);

  return (
    <div
      className="card product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Product Image Container */}
      <div
        style={{
          position: 'relative',
          height: '210px',
          overflow: 'hidden',
          backgroundColor: '#F5EFE0',
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
          }}
          className="product-img"
        />

        {/* Category Pill */}
        <span
          className="badge badge-gold"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            boxShadow: 'var(--shadow-sm)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {product.category}
        </span>

        {/* Stock Status Badge */}
        {!product.availability && (
          <span
            className="badge badge-danger"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Info */}
      <div
        className="card-body"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.3,
            }}
          >
            <Link
              to={`/product/${product._id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {product.description}
        </p>

        {/* Price & Action Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-light)',
            gap: '8px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Price
            </span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--accent-brown)',
              }}
            >
              ₹{product.price}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <Link
              to={`/product/${product._id}`}
              className="btn btn-outline btn-sm"
              title="View Details & Nutrition"
              style={{ padding: '8px 12px' }}
            >
              <Eye size={15} />
              Details
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={!product.availability}
              className={`btn btn-sm ${product.availability ? 'btn-primary' : 'btn-disabled'}`}
              style={{ padding: '8px 14px' }}
              title={product.availability ? 'Add to Cart' : 'Out of Stock'}
            >
              <ShoppingCart size={15} />
              Add
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
