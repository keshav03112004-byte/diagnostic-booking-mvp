import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useInquiryModal } from '../context/InquiryModalContext';
import { ShoppingCart, Zap, Phone, Menu, X } from 'lucide-react';
import Logo from './Logo';
import NavSearch from './NavSearch';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();
  const { openInquiryModal } = useInquiryModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const openQuickBook = () => {
    setMenuOpen(false);
    openInquiryModal({
      subject: 'Booking Inquiry',
      message: 'I would like help booking a diagnostic test or package.',
    });
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
          menuOpen ? 'navbar-menu-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="container navbar-inner">
          <Link to="/" className="logo" aria-label="energex.life home">
            <Logo height={40} />
            <span className="logo-slogan" aria-hidden="true">
              better health. <span>better life</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <Link to="/tests">Tests</Link>
            <Link to="/packages">Packages</Link>
            <button type="button" className="nav-quick" onClick={openQuickBook}>
              <Zap size={14} color="#FACC15" strokeWidth={2.5} fill="#FACC15" />
              Quick Book
            </button>
          </nav>

          <div className="nav-actions">
            <NavSearch className="nav-search-desktop" />

            {count > 0 && (
              <Link to="/checkout" className="cart-btn" aria-label={`Cart with ${count} items`}>
                <ShoppingCart size={15} strokeWidth={2.25} />
                <span>{count}</span>
              </Link>
            )}

            {isAuthenticated && (
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
            )}

            <button
              type="button"
              className="nav-menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} strokeWidth={2.25} /> : <Menu size={20} strokeWidth={2.25} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="nav-mobile-panel">
            <NavSearch className="nav-search-mobile" onNavigate={() => setMenuOpen(false)} />
            <nav className="nav-mobile-links" aria-label="Mobile">
              <Link to="/tests" onClick={() => setMenuOpen(false)}>
                Tests
              </Link>
              <Link to="/packages" onClick={() => setMenuOpen(false)}>
                Packages
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <button type="button" className="nav-mobile-quick" onClick={openQuickBook}>
                <Zap size={15} color="#FACC15" strokeWidth={2.5} fill="#FACC15" />
                Quick Book
              </button>
              {isAuthenticated ? (
                <>
                  <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
                    My Bookings
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <button type="button" className="nav-mobile-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : null}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
