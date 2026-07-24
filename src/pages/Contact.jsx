import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { inquiryAPI } from '../api/api';
import Seo from '../components/Seo';
import { pageSeo } from '../config/seo';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await inquiryAPI.create(form);
      setSuccess(true);
      setForm({ name: '', email: '', mobile: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo {...pageSeo.contact} />
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Have a question? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-grid">
          <div className="contact-info card">
            <h2>Get in Touch</h2>
            <p>Our team typically responds within 24 hours on business days.</p>
            <ul className="contact-details">
              <li>
                <Phone size={16} strokeWidth={2.25} />
                <a href="tel:+919256525580">+91 9256525580</a>
              </li>
              <li>
                <Mail size={16} strokeWidth={2.25} />
                <a href="mailto:support@energex.life">support@energex.life</a>
              </li>
              <li>
                <MapPin size={16} strokeWidth={2.25} />
                <span>Gurgaon, Delhi NCR & Bangalore</span>
              </li>
            </ul>
            <div className="contact-hours">
              <strong>Support Hours</strong>
              <p>Mon – Sat: 7:00 AM – 9:00 PM</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form card">
            {success && (
              <div className="alert alert-success">
                Thank you! Your inquiry has been submitted. We&apos;ll get back to you soon.
              </div>
            )}
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>Full Name *</label>
              <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
            </div>

            <div className="form-group">
              <label>Mobile *</label>
              <input
                required
                type="tel"
                value={form.mobile}
                onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile"
                maxLength={10}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" />
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input required value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="What is this about?" />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="Tell us how we can help..."
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
