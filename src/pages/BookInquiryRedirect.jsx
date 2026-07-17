import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInquiryModal } from '../context/InquiryModalContext';

/** Legacy /login and /register URLs open the book-test inquiry instead of auth forms. */
export default function BookInquiryRedirect() {
  const { openInquiryModal } = useInquiryModal();
  const navigate = useNavigate();

  useEffect(() => {
    openInquiryModal({
      subject: 'Book a Test',
      message: 'I would like to book a diagnostic test or health package. Please help me get started.',
    });
    navigate('/', { replace: true });
  }, [openInquiryModal, navigate]);

  return (
    <div className="loading">
      Opening booking inquiry...
    </div>
  );
}
