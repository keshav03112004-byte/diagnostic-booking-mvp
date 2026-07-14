import { Link } from 'react-router-dom';
import { Phone, Zap } from 'lucide-react';
import { useInquiryModal } from '../context/InquiryModalContext';
import './FloatingCTA.css';

export default function FloatingCTA() {
  const { openInquiryModal } = useInquiryModal();

  return (
    <div className="floating-cta">
      <a href="tel:+919998880005" className="btn btn-secondary-light floating-btn">
        <Phone size={16} color="currentColor" strokeWidth={2.25} /> Call Expert
      </a>
      <button
        type="button"
        className="btn btn-primary floating-btn"
        onClick={() =>
          openInquiryModal({
            subject: 'Booking Inquiry',
            message: 'I would like help booking a diagnostic test or package.',
          })
        }
      >
        <Zap size={16} color="#fff" strokeWidth={2.25} fill="#fff" /> Quick Book
      </button>
    </div>
  );
}
