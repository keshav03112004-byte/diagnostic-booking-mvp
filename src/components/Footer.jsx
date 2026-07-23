import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Zap } from 'lucide-react';
import Logo from './Logo';
import { getWhatsAppUrl } from '../utils/whatsapp';
import './Footer.css';

function FacebookIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.84c0-2.37 1.4-3.68 3.55-3.68 1.03 0 2.1.18 2.1.18v2.32h-1.18c-1.17 0-1.53.73-1.53 1.48v1.78h2.61l-.42 2.9h-2.19V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-2.25.1-3.3 1.17-3.4 3.4-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.1 2.22 1.16 3.3 3.4 3.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c2.25-.1 3.3-1.17 3.4-3.4.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.1-2.22-1.16-3.3-3.4-3.4-1.24-.06-1.61-.07-4.76-.07zm0 3.06a5.18 5.18 0 1 1 0 10.36 5.18 5.18 0 0 1 0-10.36zm0 8.55a3.37 3.37 0 1 0 0-6.74 3.37 3.37 0 0 0 0 6.74zm6.41-8.78a1.21 1.21 0 1 1-2.42 0 1.21 1.21 0 0 1 2.42 0z" />
    </svg>
  );
}

export default function Footer() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo" aria-label="energex.life home">
                <Logo height={48} />
              </Link>
              <p className="footer-slogan" aria-hidden="true">
                better health. <span>better life</span>
              </p>
              <p className="footer-desc">
                Premium diagnostics & wellness checkups delivered to your doorstep.
                Trusted accredited partner laboratories. Reports in 24 hours.
              </p>
              <div className="footer-badges">
                <span>Accredited Diagnostics</span>
                <span>100% Secure</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <nav className="footer-links" aria-label="Quick links">
                <Link to="/packages">Health Packages</Link>
                <Link to="/tests">All Tests</Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-whatsapp-link">
                  <Zap size={14} strokeWidth={2.4} fill="currentColor" />
                  Quick Book
                </a>
                <Link to="/contact">Contact Us</Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-whatsapp-link">
                  <Zap size={14} strokeWidth={2.4} fill="currentColor" />
                  Book a Test
                </a>
              </nav>
            </div>

            <div className="footer-col">
              <h4>Health Concerns</h4>
              <nav className="footer-links" aria-label="Health concerns">
                <Link to="/disease/diabetes">Diabetes</Link>
                <Link to="/disease/thyroid">Thyroid</Link>
                <Link to="/disease/heart">Heart</Link>
                <Link to="/disease/liver">Liver</Link>
                <Link to="/disease/kidney">Kidney</Link>
              </nav>
            </div>

            <div className="footer-col">
              <h4>Contact</h4>
              <ul className="footer-contact">
                <li>
                  <Phone size={16} strokeWidth={2.25} />
                  <a href="tel:+919256525580">+91 9256525580</a>
                </li>
                <li>
                  <Mail size={16} strokeWidth={2.25} />
                  <a href="mailto:support@energex.life">support@energex.life</a>
                </li>
                <li>
                  <MapPin size={16} strokeWidth={2.25} />
                  <span>Jaipur, Rajasthan</span>
                </li>
              </ul>
              <div className="footer-social" aria-label="Social media">
                <a
                  href="https://www.facebook.com/profile.php?id=61591829013415"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="EnergeX Life on Facebook"
                >
                  <FacebookIcon size={18} />
                </a>
                <a
                  href="https://www.instagram.com/energex.life/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="energex.life on Instagram"
                >
                  <InstagramIcon size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} energex.life. All rights reserved.</span>
          <span>Made for healthier mornings.</span>
        </div>
      </div>
    </footer>
  );
}
