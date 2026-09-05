import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  User,
  PlusCircle,
  Bell,
  Volume2,
  VolumeX,
  Check,
  CheckCheck,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminNotification } from '../../context/AdminNotificationContext';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 45) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const AdminHeader = ({ title, onToggleSidebar }) => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    soundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useAdminNotification();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
    navigate('/admin/orders');
  };

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            padding: '4px',
          }}
          className="admin-menu-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Add Product Shortcut */}
        <Link
          to="/admin/products/add"
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <PlusCircle size={16} />
          <span className="hide-mobile">Add Product</span>
        </Link>

        {/* Real-time Order Notification Bell */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={`Notifications (${unreadCount} unread)`}
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: isOpen ? 'var(--primary-light)' : 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: unreadCount > 0 ? 'var(--primary-dark)' : 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Bell
              size={20}
              className={unreadCount > 0 ? 'bell-ringing' : ''}
              color={unreadCount > 0 ? 'var(--primary)' : 'currentColor'}
            />

            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: '#E53935',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 0 0 2px #FFFFFF, 0 2px 6px rgba(229, 57, 53, 0.4)',
                  animation: 'badgePulse 2s infinite',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: '380px',
                maxWidth: '90vw',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'dropdownFadeIn 0.2s ease-out forwards',
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#FAFAF7',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text)' }}>
                    Order Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Sound mute/unmute button */}
                  <button
                    onClick={toggleSound}
                    title={soundEnabled ? 'Order sound alert ON (click to mute)' : 'Order sound alert MUTED (click to unmute)'}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: soundEnabled ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      gap: '4px',
                    }}
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  {/* Mark all as read button */}
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      title="Mark all notifications as read"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <CheckCheck size={14} />
                      <span>Read all</span>
                    </button>
                  )}

                  {/* Clear all notifications */}
                  {notifications && notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      title="Clear and delete all notifications"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#E53935',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div
                style={{
                  maxHeight: '340px',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                }}
              >
                {notifications && notifications.length > 0 ? (
                  notifications.map((n) => {
                    const customer = n.orderData?.customerName || 'A customer';
                    const amount = n.orderData?.totalAmount;
                    const items = n.orderData?.itemsCount;

                    return (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        style={{
                          padding: '14px 18px',
                          borderBottom: '1px solid #F0EFEA',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          backgroundColor: n.isRead ? '#FFFFFF' : 'rgba(78, 140, 93, 0.05)',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = n.isRead
                            ? '#FAF8F4'
                            : 'rgba(78, 140, 93, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = n.isRead
                            ? '#FFFFFF'
                            : 'rgba(78, 140, 93, 0.05)';
                        }}
                      >
                        {/* Unread indicator dot */}
                        {!n.isRead && (
                          <span
                            style={{
                              position: 'absolute',
                              left: '6px',
                              top: '18px',
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary)',
                            }}
                          />
                        )}

                        {/* Icon */}
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: n.isRead ? '#F1EFEA' : 'var(--primary-light)',
                            color: n.isRead ? 'var(--text-muted)' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ShoppingBag size={17} />
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              justifyContent: 'space-between',
                              gap: '6px',
                              marginBottom: '2px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.88rem',
                                fontWeight: n.isRead ? 600 : 800,
                                color: 'var(--text)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {customer}
                            </span>
                            {amount != null && (
                              <span
                                style={{
                                  fontSize: '0.88rem',
                                  fontWeight: 800,
                                  color: 'var(--primary)',
                                }}
                              >
                                ₹{amount}
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              lineHeight: 1.3,
                              marginBottom: '6px',
                            }}
                          >
                            {n.message || 'New order placed'}
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '4px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              <Clock size={12} />
                              <span>{formatTimeAgo(n.createdAt)}</span>
                              {items != null && (
                                <>
                                  <span>•</span>
                                  <span>{items} {items === 1 ? 'item' : 'items'}</span>
                                </>
                              )}
                            </div>

                            {/* Row Action Buttons: Mark as Read & Delete */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              {!n.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(n._id);
                                  }}
                                  title="Mark as read"
                                  style={{
                                    background: 'none',
                                    border: '1px solid rgba(78, 140, 93, 0.3)',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    padding: '3px 7px',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    backgroundColor: 'rgba(78, 140, 93, 0.08)',
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                                    e.currentTarget.style.color = '#FFFFFF';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(78, 140, 93, 0.08)';
                                    e.currentTarget.style.color = 'var(--primary)';
                                  }}
                                >
                                  <Check size={12} />
                                  <span>Read</span>
                                </button>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(n._id);
                                }}
                                title="Delete notification"
                                style={{
                                  background: 'none',
                                  border: '1px solid #EAEAEA',
                                  color: '#8E8E8E',
                                  cursor: 'pointer',
                                  padding: '3px 6px',
                                  borderRadius: '5px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem',
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFEBEE';
                                  e.currentTarget.style.borderColor = '#FFCDD2';
                                  e.currentTarget.style.color = '#E53935';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.borderColor = '#EAEAEA';
                                  e.currentTarget.style.color = '#8E8E8E';
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <ShoppingBag
                      size={36}
                      style={{ margin: '0 auto 12px', opacity: 0.35 }}
                    />
                    <p style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>
                      No order notifications
                    </p>
                    <p style={{ fontSize: '0.8rem' }}>
                      Incoming customer orders will appear here in real-time.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div
                style={{
                  padding: '12px 18px',
                  backgroundColor: '#FAFAF7',
                  borderTop: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/admin/orders');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>View all orders in Order Management</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={16} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'block',
                color: 'var(--text)',
              }}
            >
              {user?.name || 'Administrator'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Super Admin
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes badgePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        @keyframes bellWiggle {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(14deg); }
          40% { transform: rotate(-14deg); }
          60% { transform: rotate(8deg); }
          80% { transform: rotate(-8deg); }
        }
        .bell-ringing {
          animation: bellWiggle 1.8s infinite ease-in-out;
          transform-origin: top center;
        }
        @media (max-width: 900px) {
          .admin-menu-btn {
            display: block !important;
          }
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;
