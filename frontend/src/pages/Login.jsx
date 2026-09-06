import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/products';

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      addToast('Login successful! Welcome back.', 'success');
      
      // If user is Admin, navigate directly to Admin Dashboard
      if (loggedUser?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        padding: '60px 20px 80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '36px 30px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              marginBottom: '20px',
            }}
          >
            <img
              src="/logo.png"
              alt="NutriHeal Bakes"
              style={{
                height: '54px',
                width: '54px',
                borderRadius: '50%',
                objectFit: 'contain',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--primary-dark)',
                  letterSpacing: '0.03em',
                  display: 'block',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                NUTRIHEAL BAKES
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--accent-brown)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginTop: '2px',
                }}
              >
                Healthy Bakes • Smart Nutrition
              </span>
            </div>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Login</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Access your orders, cart, and healthy nutrition profile
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--danger-light)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontSize: '0.88rem',
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
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@nutriheal.com"
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
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>



        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--primary)', fontWeight: 700 }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
