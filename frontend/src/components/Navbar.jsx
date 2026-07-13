import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-inner">
          <span>🎉 Free home sample collection on every booking</span>
          <span className="top-bar-phone">📞 +91 999-888-0005</span>
        </div>
      </div>
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">D</span>
            <span className="logo-text">
              Diag<span className="logo-accent">Book</span>
            </span>
          </Link>

          <nav className="nav-links">
            <Link to="/tests">Tests</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/book/quick" className="nav-quick">⚡ Quick Book</Link>
          </nav>

          <div className="nav-actions">
            {count > 0 && (
              <Link to="/checkout" className="cart-btn">
                🛒 {count}
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="nav-link-desktop">Bookings</Link>
                <Link to="/profile" className="nav-avatar">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Link>
                <button type="button" className="btn btn-ghost btn-sm nav-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
