import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { testAPI, packageAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useInquiryModal } from '../context/InquiryModalContext';
import BookingForm from '../components/BookingForm';
import './QuickBook.css';

export default function QuickBook() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openInquiryModal } = useInquiryModal();
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState(null);

  const preselectedType = searchParams.get('type');
  const preselectedId = searchParams.get('id');
  const preselectedName = searchParams.get('name');
  const preselectedPrice = searchParams.get('price');

  useEffect(() => {
    Promise.all([testAPI.getAll(), packageAPI.getAll()]).then(([testsRes, packagesRes]) => {
      setTests(testsRes.data.tests);
      setPackages(packagesRes.data.packages);
    });
  }, []);

  useEffect(() => {
    if (preselectedType && preselectedId && preselectedName && preselectedPrice) {
      setSelected({
        itemType: preselectedType,
        itemId: preselectedId,
        name: decodeURIComponent(preselectedName),
        price: Number(preselectedPrice),
      });
    }
  }, [preselectedType, preselectedId, preselectedName, preselectedPrice]);

  const handleSelect = (e) => {
    const value = e.target.value;
    if (!value) {
      setSelected(null);
      return;
    }
    const [type, id] = value.split(':');
    const list = type === 'test' ? tests : packages;
    const item = list.find((i) => i._id === id);
    if (item) {
      setSelected({
        itemType: type,
        itemId: item._id,
        name: item.name,
        price: item.price,
      });
    }
  };

  const handleSuccess = (booking) => {
    setSuccess(booking);
    window.scrollTo(0, 0);
  };

  if (success) {
    return (
      <div className="container section">
        <div className="success-card card">
          <div className="success-icon">✓</div>
          <h1>Booking Confirmed!</h1>
          <p>Your order ID is <strong>{success.orderId}</strong></p>
          <div className="success-details">
            <p><strong>Patient:</strong> {success.patientName}</p>
            <p><strong>Collection:</strong> {new Date(success.collectionDate).toLocaleDateString()} ({success.timeSlot})</p>
            <p><strong>Amount:</strong> ₹{success.totalAmount}</p>
            <p><strong>Status:</strong> {success.status}</p>
          </div>
          <div className="success-actions">
            <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
            <Link to="/" className="btn btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Quick Book</h1>
          <p>Book a diagnostic test in 2 minutes — no account required</p>
        </div>
      </div>

      <div className="container section quick-book-layout">
        <div className="quick-book-sidebar card">
          <h3>Select Test or Package</h3>
          <div className="form-group">
            <select value={selected ? `${selected.itemType}:${selected.itemId}` : ''} onChange={handleSelect}>
              <option value="">Choose a test or package...</option>
              <optgroup label="Tests">
                {tests.map((test) => (
                  <option key={test._id} value={`test:${test._id}`}>
                    {test.name} — ₹{test.price}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Packages">
                {packages.map((pkg) => (
                  <option key={pkg._id} value={`package:${pkg._id}`}>
                    {pkg.name} — ₹{pkg.price}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {selected && (
            <div className="selected-item">
              <h4>{selected.name}</h4>
              <p className="price">₹{selected.price}</p>
            </div>
          )}

          <p className="quick-note">
            Prefer a callback instead?{' '}
            <button
              type="button"
              className="quick-note-link"
              onClick={() =>
                openInquiryModal({
                  subject: 'Book a Test',
                  message: selected
                    ? `I would like to book: ${selected.name} (₹${selected.price}).`
                    : 'I would like to book a diagnostic test or health package. Please help me get started.',
                })
              }
            >
              Send a booking inquiry
            </button>
          </p>
        </div>

        <div className="quick-book-form card">
          <h3>Booking Details</h3>
          {!selected && (
            <div className="alert alert-info">Please select a test or package to continue.</div>
          )}
          <BookingForm
            items={selected ? [selected] : []}
            isQuickBook
            onSuccess={handleSuccess}
            defaultValues={{
              patientName: user?.name || '',
              patientMobile: user?.mobile || '',
              patientEmail: user?.email || '',
              patientAge: user?.age || '',
              patientGender: user?.gender || '',
              city: user?.addresses?.find((a) => a.isDefault)?.city || '',
            }}
          />
        </div>
      </div>
    </>
  );
}
