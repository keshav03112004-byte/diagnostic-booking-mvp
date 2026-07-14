import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import './QuickBook.css';

export default function Checkout() {
  const { items, total, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(null);

  const handleSuccess = (booking) => {
    clearCart();
    setSuccess(booking);
  };

  if (success) {
    return (
      <div className="container section">
        <div className="success-card card">
          <div className="success-icon">✓</div>
          <h1>Booking Confirmed!</h1>
          <p>Order ID: <strong>{success.orderId}</strong></p>
          <p>Total: ₹{success.totalAmount}</p>
          <div className="success-actions">
            <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state card">
          <h2>Your cart is empty</h2>
          <p>Add tests or packages to proceed with booking.</p>
          <Link to="/tests" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Tests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          <p>Review your order and schedule home sample collection</p>
        </div>
      </div>

      <div className="container section quick-book-layout">
        <div className="quick-book-sidebar card">
          <h3>Order Summary</h3>
          <ul className="cart-items">
            {items.map((item) => (
              <li key={`${item.itemType}-${item.itemId}`}>
                <div>
                  <strong>{item.name}</strong>
                  <span className="badge badge-primary">{item.itemType}</span>
                </div>
                <div className="cart-item-actions">
                  <span>₹{item.price}</span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(item.itemId, item.itemType)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Total</span>
            <strong className="price">₹{total}</strong>
          </div>
        </div>

        <div className="quick-book-form card">
          <h3>Patient & Collection Details</h3>
          <BookingForm
            items={items}
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
