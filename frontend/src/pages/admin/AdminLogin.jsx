import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated, login, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role !== 'admin') {
        logout();
        setError('Access Denied: You do not have administrator privileges.');
        return;
      }

      addToast('Welcome to NutriHeal Admin Portal', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1C2620',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '40px 32px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            Authorized Personnel Only
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--danger-light)',
              borderRadius: '10px',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nutriheal.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '12px', fontWeight: 700 }}
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          Default Seed Admin: <strong>admin@nutriheal.com</strong> / <strong>Admin@12345</strong>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
