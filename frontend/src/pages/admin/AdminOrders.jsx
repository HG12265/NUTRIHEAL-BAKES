import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, Eye, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAdminNotification } from '../../context/AdminNotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const statuses = [
  'All',
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { addToast } = useToast();
  const { refreshTrigger } = useAdminNotification();

  const fetchOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const params = {};
      if (statusFilter && statusFilter !== 'All') {
        params.status = statusFilter;
      }
      const res = await api.get('/admin/orders', { params });
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      if (!isSilent) addToast('Failed to load orders', 'error');
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
  }, [statusFilter]);

  // Silently re-fetch when new orders arrive via real-time notification
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchOrders(true);
    }
  }, [refreshTrigger]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        addToast(`Order #${orderId.slice(-6).toUpperCase()} updated to ${newStatus}`, 'success');
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  return (
    <div>
      {/* Header & Status Filters */}
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
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Order Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track and process customer bakery orders
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {statuses.map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--primary)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text)',
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
        {loading ? (
          <LoadingSpinner size={32} message="Loading orders..." />
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders found for this filter.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong style={{ fontSize: '0.85rem' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </strong>
                    </td>

                    <td>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>
                        {order.shippingAddress.fullName}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {order.shippingAddress.phone}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <strong style={{ color: 'var(--accent-brown)' }}>
                        ₹{order.totalAmount}
                      </strong>
                    </td>

                    {/* Status Dropdown */}
                    <td>
                      <select
                        className="form-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          backgroundColor:
                            order.status === 'Delivered'
                              ? 'var(--success-light)'
                              : order.status === 'Cancelled'
                              ? 'var(--danger-light)'
                              : 'var(--highlight-gold-light)',
                          color:
                            order.status === 'Delivered'
                              ? 'var(--success)'
                              : order.status === 'Cancelled'
                              ? 'var(--danger)'
                              : '#8C6212',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '14px',
              }}
            >
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '4px' }}>
                  Order Details
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  #{selectedOrder._id}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              <select
                className="form-select"
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
                Items Ordered
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((i, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <span>
                      {i.productName} <strong>× {i.quantity}</strong>
                    </span>
                    <strong>₹{i.subtotal}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                marginBottom: '20px',
                fontSize: '0.85rem',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ display: 'block', marginBottom: '4px' }}>
                Shipping Recipient: {selectedOrder.shippingAddress.fullName}
              </strong>
              <div>{selectedOrder.shippingAddress.address}</div>
              <div>{selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}</div>
              <div>Phone: {selectedOrder.shippingAddress.phone}</div>
              <div>Email: {selectedOrder.shippingAddress.email}</div>
            </div>

            {/* Totals */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '14px',
                marginBottom: '24px',
              }}
            >
              <span style={{ fontWeight: 600 }}>Grand Total</span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--accent-brown)' }}>
                ₹{selectedOrder.totalAmount}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-outline btn-sm"
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

export default AdminOrders;
