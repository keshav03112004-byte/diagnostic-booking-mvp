import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { inquiryAPI } from '../api/api';
import { useInquiryModal } from '../context/InquiryModalContext';
import './InquiryModal.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  mobile: '',
  subject: '',
  message: '',
};

export default function InquiryModal() {
  const { isOpen, defaults, closeInquiryModal } = useInquiryModal();
  const titleId = useId();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;

    setForm({
      ...EMPTY_FORM,
      subject: defaults.subject || 'Booking Inquiry',
      message: defaults.message || '',
    });
    setSuccess(false);
    setError('');
    setLoading(false);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeInquiryModal();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, defaults, closeInquiryModal]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await inquiryAPI.create(form);
      setSuccess(true);
      setForm({
        ...EMPTY_FORM,
        subject: defaults.subject || 'Booking Inquiry',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="inquiry-modal-root" role="presentation">
      <button
        type="button"
        className="inquiry-modal-backdrop"
        aria-label="Close inquiry form"
        onClick={closeInquiryModal}
      />
      <div
        className="inquiry-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="inquiry-modal-header">
          <div>
            <p className="inquiry-modal-eyebrow">General Inquiry</p>
            <h2 id={titleId} className="inquiry-modal-title">
              Book a callback
            </h2>
            <p className="inquiry-modal-subtitle">
              Share your details and our team will help you book in minutes.
            </p>
          </div>
          <button
            type="button"
            className="inquiry-modal-close"
            onClick={closeInquiryModal}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {success ? (
          <div className="inquiry-modal-success">
            <div className="alert alert-success">
              Thank you! Your inquiry has been submitted. We&apos;ll get back to you soon.
            </div>
            <button type="button" className="btn btn-primary" onClick={closeInquiryModal}>
              Done
            </button>
          </div>
        ) : (
          <form className="inquiry-modal-form" onSubmit={handleSubmit}>
            {error ? <div className="alert alert-error">{error}</div> : null}

            <div className="form-group">
              <label htmlFor="inquiry-name">Full Name *</label>
              <input
                id="inquiry-name"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Your name"
                autoFocus
              />
            </div>

            <div className="inquiry-modal-row">
              <div className="form-group">
                <label htmlFor="inquiry-mobile">Mobile *</label>
                <input
                  id="inquiry-mobile"
                  required
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile"
                  maxLength={10}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-email">Email</label>
                <input
                  id="inquiry-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="inquiry-subject">Subject *</label>
              <input
                id="inquiry-subject"
                required
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                placeholder="Booking / test inquiry"
              />
            </div>

            <div className="form-group">
              <label htmlFor="inquiry-message">Message *</label>
              <textarea
                id="inquiry-message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="Tell us which tests or packages you need..."
              />
            </div>

            <div className="inquiry-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeInquiryModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
