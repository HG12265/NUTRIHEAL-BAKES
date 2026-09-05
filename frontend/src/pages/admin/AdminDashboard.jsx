import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  CheckCircle,
  Package,
  Clock,
  Users,
  ArrowRight,
  Eye,
  PlusCircle,
  QrCode,
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAdminNotification } from '../../context/AdminNotificationContext';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = useAdminNotification();

  useEffect(() => {
    const fetchDashboardStats = async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };

    fetchDashboardStats(refreshTrigger > 0);
  }, [refreshTrigger]);

  if (loading) {
    return <LoadingSpinner size={36} message="Loading dashboard statistics..." />;
  }

  const stats = data?.stats || {
    totalProducts: 0,
    availableProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
  };

  const statCards = [
    {
      title: 'Total Products',
      val: stats.totalProducts,
      icon: ShoppingBag,
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
      link: '/admin/products',
    },
    {
      title: 'Available In Stock',
      val: stats.availableProducts,
      icon: CheckCircle,
      color: '#3E8E41',
      bg: '#E8F5E9',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      val: stats.totalOrders,
      icon: Package,
      color: 'var(--accent-brown)',
      bg: 'var(--accent-brown-light)',
      link: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      val: stats.pendingOrders,
      icon: Clock,
      color: '#C67A1B',
      bg: '#FDF5E7',
      link: '/admin/orders',
    },
    {
      title: 'Total Customers',
      val: stats.totalUsers,
      icon: Users,
      color: '#4A7C9A',
      bg: '#EDF5F9',
      link: '/admin/users',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome, Admin</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            NutriHeal Bakes store overview & recent operational activity
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/products/add" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Add Product
          </Link>
          <Link to="/admin/qr-codes" className="btn btn-gold btn-sm">
            <QrCode size={16} /> QR Hub
          </Link>
        </div>
      </div>

      {/* 5 Summary Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to={c.link}
              className="card"
              style={{
                padding: '22px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  backgroundColor: c.bg,
                  color: c.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={24} />
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    display: 'block',
                  }}
                >
                  {c.title}
                </span>
                <strong
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text)',
                    lineHeight: 1.1,
                  }}
                >
                  {c.val}
                </strong>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Grid: Recent Orders & Recently Added Products */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Recent Orders */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Orders</h2>
            <Link
              to="/admin/orders"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {data?.recentOrders && data.recentOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong style={{ fontSize: '0.85rem' }}>
                          #{order._id.slice(-6).toUpperCase()}
                        </strong>
                      </td>
                      <td>{order.user?.name || 'Customer'}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === 'Delivered'
                              ? 'badge-success'
                              : order.status === 'Cancelled'
                              ? 'badge-danger'
                              : 'badge-gold'
                          }`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
              No recent orders yet.
            </p>
          )}
        </div>

        {/* Recently Added Products */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              Recent Products
            </h2>
            <Link
              to="/admin/products"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Manage <ArrowRight size={14} />
            </Link>
          </div>

          {data?.recentProducts && data.recentProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <strong style={{ fontSize: '0.85rem' }}>{p.name}</strong>
                      </td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>
                        <span
                          className={`badge ${p.availability ? 'badge-success' : 'badge-danger'}`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {p.availability ? 'Active' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
