import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../services/api';
import ProductGrid from '../components/product/ProductGrid';

const categories = ['All', 'Cookies', 'Bread', 'Cakes', 'Desserts'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const res = await api.get('/products', { params });
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search query
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container" style={{ padding: '40px 20px 60px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>
          Our Healthy Bakes
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Artisanal bakes crafted from healthy millets, whole wheat, and natural superfoods.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '6px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '8px 18px',
                  backgroundColor: isActive ? 'var(--primary)' : '#FFFFFF',
                  borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                  color: isActive ? '#FFFFFF' : 'var(--text)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div
          style={{
            position: 'relative',
            maxWidth: '480px',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search by product name or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '44px',
              paddingRight: searchQuery ? '40px' : '16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FFFFFF',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
        }}
      >
        <span>
          Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Product Catalog Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage="No bakery products found matching your search. Try another category or keyword."
      />
    </div>
  );
};

export default Products;
