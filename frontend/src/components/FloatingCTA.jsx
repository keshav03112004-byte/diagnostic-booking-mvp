import { Link } from 'react-router-dom';
import './FloatingCTA.css';

export default function FloatingCTA() {
  return (
    <div className="floating-cta">
      <a href="tel:+919998880005" className="floating-btn floating-btn-call">
        📞 Call Expert
      </a>
      <Link to="/book/quick" className="floating-btn floating-btn-book">
        ⚡ Quick Book
      </Link>
    </div>
  );
}
