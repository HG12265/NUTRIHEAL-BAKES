import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AdminNotificationContext = createContext();

export const useAdminNotification = () => {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error('useAdminNotification must be used within an AdminNotificationProvider');
  }
  return context;
};

export const AdminNotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('nutriheal_admin_sound') !== 'false';
  });
  const [activeToast, setActiveToast] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const eventSourceRef = useRef(null);
  const pollTimerRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Play modern soft bell chime via Web Audio API
  const playChime = useCallback(() => {
    if (!soundEnabled) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Note 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Note 2: C6 (1046.50 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, now + 0.12);
      gain2.gain.setValueAtTime(0.3, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch (err) {
      console.warn('Web Audio chime could not play:', err);
    }
  }, [soundEnabled]);

  // Toggle sound setting
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('nutriheal_admin_sound', next ? 'true' : 'false');
      return next;
    });
  }, []);

  // Show floating toast alert for incoming order
  const triggerNewOrderAlert = useCallback((notification) => {
    playChime();

    // Set floating toast
    setActiveToast(notification);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    // Auto dismiss after 8 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 8000);

    // Bump refresh trigger for dashboard/orders listeners
    setRefreshTrigger((prev) => prev + 1);
  }, [playChime]);

  // Fetch recent notifications list
  const fetchNotifications = useCallback(async () => {
    if (!user || user.role !== 'admin') return;

    try {
      const res = await api.get('/admin/notifications?limit=25');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch admin notifications:', err);
    }
  }, [user]);

  // Mark single notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      const res = await api.put(`/admin/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(res.data.unreadCount ?? 0);
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const res = await api.put('/admin/notifications/read-all');
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  // Delete single notification
  const deleteNotification = useCallback(async (id) => {
    try {
      const res = await api.delete(`/admin/notifications/${id}`);
      if (res.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        if (res.data.unreadCount != null) {
          setUnreadCount(res.data.unreadCount);
        }
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      const res = await api.delete('/admin/notifications');
      if (res.data.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  // Connect SSE & setup polling fallback
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    fetchNotifications();

    const authToken = token || localStorage.getItem('nutriheal_token');

    // Connect to Server-Sent Events stream
    if (authToken && typeof EventSource !== 'undefined') {
      try {
        const streamUrl = `${api.defaults.baseURL || 'https://nutriheal-bakes.onrender.com/api'}/admin/notifications/stream?token=${authToken}`;
        const es = new EventSource(streamUrl);

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NOTIFICATION' && data.data) {
              const newNotif = data.data;
              setNotifications((prev) => [newNotif, ...prev.filter((n) => n._id !== newNotif._id)]);
              setUnreadCount((prev) => prev + 1);
              triggerNewOrderAlert(newNotif);
            }
          } catch (parseErr) {
            // Heartbeat or malformed frame
          }
        };

        es.onerror = () => {
          // SSE dropped or reconnecting
          es.close();
        };

        eventSourceRef.current = es;
      } catch (err) {
        console.warn('SSE connection failed, falling back to polling:', err);
      }
    }

    // Smart polling fallback every 12 seconds
    pollTimerRef.current = setInterval(() => {
      fetchNotifications();
    }, 12000);

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [user, token, fetchNotifications, triggerNewOrderAlert]);

  const value = {
    notifications,
    unreadCount,
    soundEnabled,
    toggleSound,
    activeToast,
    dismissToast,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications: fetchNotifications,
    refreshTrigger,
    playChime,
  };

  return (
    <AdminNotificationContext.Provider value={value}>
      {children}
    </AdminNotificationContext.Provider>
  );
};
