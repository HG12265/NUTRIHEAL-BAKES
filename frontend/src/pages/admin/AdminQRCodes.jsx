import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Download,
  Printer,
  RotateCw,
  Eye,
  ExternalLink,
  Search,
  CheckCircle,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const AdminQRCodes = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [previewProduct, setPreviewProduct] = useState(null);
  const [regeneratingId, setRegeneratingId] = useState(null);

  const { addToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      addToast('Failed to load products for QR management', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRegenerateQR = async (productId) => {
    setRegeneratingId(productId);
    try {
      const res = await api.post(`/products/${productId}/qr`);
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === productId
              ? {
                  ...p,
                  qrCodeDataUrl: res.data.data.qrCodeDataUrl,
                  qrCodeUrl: res.data.data.qrCodeUrl,
                }
              : p
          )
        );
        addToast('QR Code regenerated successfully', 'success');
        if (previewProduct && previewProduct._id === productId) {
          setPreviewProduct({
            ...previewProduct,
            qrCodeDataUrl: res.data.data.qrCodeDataUrl,
          });
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to regenerate QR', 'error');
    } finally {
      setRegeneratingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
        className="no-print"
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>QR Code Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage, download high-res PNGs, and print batch product QR codes
          </p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
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
            placeholder="Search by product or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px', borderRadius: 'var(--radius-full)' }}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="card no-print" style={{ backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
        {loading ? (
          <LoadingSpinner size={32} message="Loading QR codes..." />
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No products found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>QR Status</th>
                  <th>QR Target URL</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {p.qrCodeDataUrl ? (
                          <img
                            src={p.qrCodeDataUrl}
                            alt="QR thumbnail"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              cursor: 'pointer',
                            }}
                            onClick={() => setPreviewProduct(p)}
                          />
                        ) : (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <QrCode size={20} color="var(--text-muted)" />
                          </div>
                        )}
                        <div>
                          <strong style={{ fontSize: '0.95rem', display: 'block' }}>
                            {p.name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <code style={{ fontSize: '0.85rem', color: 'var(--accent-brown)' }}>
                        {p.sku || 'NHB-PKG'}
                      </code>
                    </td>

                    <td>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                        <CheckCircle size={12} /> Active
                      </span>
                    </td>

                    <td style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a
                        href={p.qrCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'underline' }}
                      >
                        {p.qrCodeUrl}
                      </a>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => setPreviewProduct(p)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          title="Preview QR"
                        >
                          <Eye size={14} /> View
                        </button>

                        <a
                          href={`http://localhost:5000/api/products/${p._id}/qr/download`}
                          download={`${p.slug || 'product'}-qr.png`}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          title="Download PNG"
                        >
                          <Download size={14} /> Download
                        </a>

                        <button
                          onClick={() => handleRegenerateQR(p._id)}
                          disabled={regeneratingId === p._id}
                          className="btn btn-outline-brown btn-sm"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          title="Regenerate QR"
                        >
                          <RotateCw
                            size={14}
                            className={regeneratingId === p._id ? 'spin' : ''}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview & Print Modal */}
      {previewProduct && (
        <div className="modal-overlay" onClick={() => setPreviewProduct(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ textAlign: 'center', maxWidth: '440px' }}
          >
            {/* Printable Sticker Label Frame */}
            <div
              id="printable-label"
              style={{
                padding: '24px',
                border: '2px dashed var(--accent-brown)',
                borderRadius: '16px',
                backgroundColor: '#FFFDF9',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>
                NUTRIHEAL BAKES
              </h3>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Scan. Know. Choose. Order.
              </p>

              <div
                style={{
                  width: '200px',
                  height: '200px',
                  margin: '0 auto 12px',
                  backgroundColor: '#FFFFFF',
                  padding: '8px',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <img
                  src={previewProduct.qrCodeDataUrl}
                  alt={previewProduct.name}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text)' }}>
                {previewProduct.name}
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Batch: {previewProduct.batchNumber || 'NHB-2026-01'} • SKU: {previewProduct.sku}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handlePrint} className="btn btn-outline btn-sm">
                <Printer size={16} /> Print Sticker
              </button>

              <a
                href={previewProduct.qrCodeDataUrl}
                download={`${previewProduct.slug || 'product'}-qr.png`}
                className="btn btn-primary btn-sm"
              >
                <Download size={16} /> Download PNG
              </a>

              <button
                onClick={() => setPreviewProduct(null)}
                className="btn btn-outline-brown btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQRCodes;
