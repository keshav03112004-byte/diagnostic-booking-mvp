import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import '../Auth.css';
import './adminExtras.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (!authLoading && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(username.trim(), password, { username: true });
      if (data.user?.role !== 'admin') {
        logout();
        setError('This account does not have admin access.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-login-page">
      <div className="auth-card card">
        <div className="admin-login-logo">
          <Logo height={56} />
        </div>
        <h1>Admin Login</h1>
        <p className="auth-subtitle">Sign in to manage energex.life</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              required
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>
        </form>
        <p className="auth-footer">
          <a href={import.meta.env.VITE_APP_MODE === 'admin' ? 'http://localhost:5173/' : '/'}>
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
