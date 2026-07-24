import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWhatsAppUrl } from '../utils/whatsapp';
import Seo from '../components/Seo';
import { pageSeo } from '../config/seo';

/** Legacy /login and /register URLs open WhatsApp booking instead of auth forms. */
export default function BookInquiryRedirect() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer');
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <>
      <Seo {...pageSeo.loginRedirect} path={pathname} />
      <div className="loading">
        Opening WhatsApp...
      </div>
    </>
  );
}
