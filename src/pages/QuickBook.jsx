import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getWhatsAppUrl, getBookingWhatsAppMessage } from '../utils/whatsapp';

/** Quick Book route opens WhatsApp — no on-site booking form. */
export default function QuickBook() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const name = searchParams.get('name');
    const price = searchParams.get('price');
    const type = searchParams.get('type') || 'test';
    const message = name
      ? getBookingWhatsAppMessage({ name, price: price ? Number(price) : undefined }, type)
      : undefined;

    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    navigate('/', { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="loading">
      Opening WhatsApp to book...
    </div>
  );
}
