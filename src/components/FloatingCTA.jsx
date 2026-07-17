import { Zap } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { getWhatsAppUrl } from '../utils/whatsapp';
import './FloatingCTA.css';

export default function FloatingCTA() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <div className="floating-cta">
      <a
        href={whatsappUrl}
        className="btn floating-btn floating-btn-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon size={18} variant="inverse" />
        WhatsApp Us
      </a>
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
