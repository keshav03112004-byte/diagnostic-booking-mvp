import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-mark">D</span>
            <strong>DiagBook</strong>
          </div>
          <p>Smart diagnostics delivered to your doorstep. Trusted lab partners. Reports in 24 hours.</p>
          <div className="footer-social">
            <span>🏥 NABL Partner Labs</span>
            <span>🔒 100% Secure</span>
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/tests">All Tests</Link>
          <Link to="/packages">Health Packages</Link>
          <Link to="/book/quick">Quick Book</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/register">Create Account</Link>
        </div>
        <div className="footer-col">
          <h4>Health Concerns</h4>
          <Link to="/disease/diabetes">Diabetes</Link>
          <Link to="/disease/thyroid">Thyroid</Link>
          <Link to="/disease/heart">Heart</Link>
          <Link to="/disease/vitamins">Vitamins</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>📞 +91 999-888-0005</p>
          <p>📧 support@diagbook.in</p>
          <p>📍 Gurgaon, Delhi NCR & Bangalore</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 DiagBook. All rights reserved.</span>
          <span>Smart Diagnostics, Delivered to Your Doorstep</span>
        </div>
      </div>
    </footer>
  );
}
