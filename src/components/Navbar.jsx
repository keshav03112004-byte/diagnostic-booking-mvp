import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useInquiryModal } from '../context/InquiryModalContext';
import { ShoppingCart, Zap, Phone } from 'lucide-react';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();
  const { openInquiryModal } = useInquiryModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {!isHome && (
        <div className="top-bar">
          <div className="container top-bar-inner">
            <span>Free home sample collection on every booking</span>
            <a className="top-bar-phone" href="tel:+919998880005">
              <Phone size={13} strokeWidth={2.25} />
              +91 999-888-0005
            </a>
          </div>
        </div>
      )}

      <header
        className={[
          'navbar',
          isHome ? 'navbar-home' : '',
          scrolled ? 'navbar-scrolled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="container navbar-inner">
          <Link to="/" className="logo" aria-label="energex.life home">
            <Logo height={54} />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <Link to="/tests">Tests</Link>
            <Link to="/packages">Packages</Link>
            <button
              type="button"
              className="nav-quick"
              onClick={() =>
                openInquiryModal({
                  subject: 'Booking Inquiry',
                  message: 'I would like help booking a diagnostic test or package.',
                })
              }
            >
              <Zap size={14} strokeWidth={2.5} />
              Quick Book
            </button>
          </nav>

          <div className="nav-actions">
            {count > 0 && (
              <Link to="/checkout" className="cart-btn" aria-label={`Cart with ${count} items`}>
                <ShoppingCart size={15} strokeWidth={2.25} />
                <span>{count}</span>
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="nav-link-desktop">
                  Bookings
                </Link>
                <Link to="/profile" className="nav-avatar" aria-label="Profile">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm nav-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm nav-login">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm nav-register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
