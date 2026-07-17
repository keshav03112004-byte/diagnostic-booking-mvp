import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Zap } from 'lucide-react';
import Logo from './Logo';
import { getWhatsAppUrl } from '../utils/whatsapp';
import './Footer.css';

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
                <Link to="/tests">All Tests</Link>
                <Link to="/packages">Health Packages</Link>
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
                  <a href="tel:+919998880005">+91 999-888-0005</a>
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
