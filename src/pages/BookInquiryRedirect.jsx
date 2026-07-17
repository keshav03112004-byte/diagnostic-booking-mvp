import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWhatsAppUrl } from '../utils/whatsapp';

/** Legacy /login and /register URLs open WhatsApp booking instead of auth forms. */
export default function BookInquiryRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer');
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="loading">
      Opening WhatsApp...
    </div>
  );
}
