import { Zap } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import './FloatingCTA.css';

export default function FloatingCTA() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <div className="floating-cta">
      <a
        href={whatsappUrl}
        className="btn btn-primary floating-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Zap size={17} strokeWidth={2.4} fill="currentColor" />
        Book Now
      </a>
    </div>
  );
}
