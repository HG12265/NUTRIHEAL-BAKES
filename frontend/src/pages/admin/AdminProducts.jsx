import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Edit,
  Trash2,
  QrCode,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { getProductImageUrl } from '../../utils/imageUrl';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProductQR, setSelectedProductQR] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const { addToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleAvailability = async (productId) => {
    try {
      const res = await api.patch(`/products/${productId}/toggle-availability`);
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? res.data.data : p))
        );
        addToast(res.data.message, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to toggle availability', 'error');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    try {
      const res = await api.delete(`/products/${deleteProductId}`);
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteProductId));
        addToast('Product deleted successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteProductId(null);
    }
  };

  const handleGenerateQR = async (productId) => {
    try {
      const res = await api.post(`/products/${productId}/qr`);
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === productId
              ? { ...p, qrCodeDataUrl: res.data.data.qrCodeDataUrl, qrCodeUrl: res.data.data.qrCodeUrl }
              : p
          )
        );
        addToast('QR Code generated successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to generate QR', 'error');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Top Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative', width: '320px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search products by name, category, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        <Link to="/admin/products/add" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Product
        </Link>
      </div>

      {/* Product Table */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
        {loading ? (
          <LoadingSpinner size={32} message="Loading product catalog..." />
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No products match your search.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>QR Code</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const imageUrl = getProductImageUrl(p.image);

                  return (
                    <tr key={p._id}>
                      {/* Product Name & Thumbnail */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={imageUrl}
                            alt={p.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80';
                            }}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              backgroundColor: '#F5EFE0',
                            }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text)' }}>
                              {p.name}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              SKU: {p.sku || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <strong style={{ color: 'var(--accent-brown)', fontSize: '1rem' }}>
                          ₹{p.price}
                        </strong>
                      </td>

                      {/* Availability Switch */}
                      <td>
                        <button
                          onClick={() => handleToggleAvailability(p._id)}
                          className={`badge ${p.availability ? 'badge-success' : 'badge-danger'}`}
                          style={{
                            cursor: 'pointer',
                            border: 'none',
                            padding: '6px 12px',
                            fontWeight: 700,
                          }}
                          title="Click to toggle availability"
                        >
                          {p.availability ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      {/* QR Thumbnail & Quick View */}
                      <td>
                        {p.qrCodeDataUrl ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={p.qrCodeDataUrl}
                              alt="QR"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                border: '1px solid var(--border)',
                              }}
                              onClick={() => setSelectedProductQR(p)}
                              title="Click to preview QR"
                            />
                            <button
                              onClick={() => setSelectedProductQR(p)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              <QrCode size={13} /> View
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGenerateQR(p._id)}
                            className="btn btn-gold btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Generate QR
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <Link
                            to={`/product/${p._id}`}
                            target="_blank"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '6px 8px' }}
                            title="Preview Customer Page"
                          >
                            <ExternalLink size={14} />
                          </Link>

                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '6px 8px' }}
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </Link>

                          <button
                            onClick={() => setDeleteProductId(p._id)}
                            className="btn btn-sm"
                            style={{
                              padding: '6px 8px',
                              backgroundColor: 'transparent',
                              border: '1px solid #E8A8A8',
                              color: 'var(--danger)',
                            }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Preview Modal */}
      {selectedProductQR && (
        <div className="modal-overlay" onClick={() => setSelectedProductQR(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ textAlign: 'center', maxWidth: '420px' }}
          >
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
              Unique Product QR
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>
              {selectedProductQR.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              SKU: {selectedProductQR.sku || 'NHB-PKG'}
            </p>

            <div
              style={{
                width: '240px',
                height: '240px',
                margin: '0 auto 20px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '2px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <img
                src={selectedProductQR.qrCodeDataUrl}
                alt="Product QR"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '8px',
                fontSize: '0.78rem',
                wordBreak: 'break-all',
                color: 'var(--text-muted)',
                marginBottom: '24px',
              }}
            >
              Target: {selectedProductQR.qrCodeUrl}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <a
                href={selectedProductQR.qrCodeDataUrl}
                download={`${selectedProductQR.slug || 'product'}-qr.png`}
                className="btn btn-primary btn-sm"
              >
                <Download size={16} /> Download PNG
              </a>

              <button
                onClick={() => setSelectedProductQR(null)}
                className="btn btn-outline btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteProductId}
        title="Delete Product?"
        message="Are you sure you want to permanently remove this product? This action cannot be reversed."
        confirmText="Delete Product"
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteProductId(null)}
      />
    </div>
  );
};

export default AdminProducts;
