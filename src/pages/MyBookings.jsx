import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
  booked: 'Booked',
  sample_collected: 'Sample Collected',
  processing: 'Processing',
  report_ready: 'Report Ready',
  cancelled: 'Cancelled',
};

export default function MyBookings() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    bookingAPI
      .getMyBookings()
      .then((res) => setBookings(res.data.bookings))
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) return <div className="loading">Loading bookings...</div>;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>My Bookings</h1>
          <p>Track your test bookings and report status</p>
        </div>
      </div>

      <div className="container section">
        {bookings.length === 0 ? (
          <div className="empty-state card">
            <h2>No bookings yet</h2>
            <p>Book your first diagnostic test to get started.</p>
            <Link to="/tests" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Tests
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="card booking-card">
                <div className="booking-header">
                  <div>
                    <strong>{booking.orderId}</strong>
                    <span className={`badge status-${booking.status}`}>
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </div>
                  <span className="price">₹{booking.totalAmount}</span>
                </div>
                <div className="booking-body">
                  <p><strong>Patient:</strong> {booking.patientName} ({booking.patientMobile})</p>
                  <p><strong>Collection:</strong> {new Date(booking.collectionDate).toLocaleDateString()} — {booking.timeSlot}</p>
                  <p><strong>Address:</strong> {booking.address.line1}, {booking.address.city} - {booking.address.pincode}</p>
                  <div className="booking-items">
                    <strong>Items:</strong>
                    <ul>
                      {booking.items.map((item, idx) => (
                        <li key={idx}>{item.name} (₹{item.price})</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="booking-footer">
                  <span>Payment: {booking.paymentStatus}</span>
                  <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
