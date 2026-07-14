import { useState } from 'react';
import { bookingAPI } from '../api/api';

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (7 AM - 11 AM)' },
  { value: 'afternoon', label: 'Afternoon (11 AM - 3 PM)' },
  { value: 'evening', label: 'Evening (3 PM - 7 PM)' },
];

export default function BookingForm({ items, onSuccess, isQuickBook = false, defaultValues = {} }) {
  const [form, setForm] = useState({
    patientName: defaultValues.patientName || '',
    patientMobile: defaultValues.patientMobile || '',
    patientEmail: defaultValues.patientEmail || '',
    patientAge: defaultValues.patientAge || '',
    patientGender: defaultValues.patientGender || '',
    collectionDate: '',
    timeSlot: 'morning',
    addressLine1: '',
    city: defaultValues.city || '',
    pincode: '',
    landmark: '',
    notes: '',
    paymentMethod: 'cod',
    ...defaultValues,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!items?.length) {
      setError('Please select at least one test or package');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          itemType: item.itemType,
          itemId: item.itemId,
        })),
        patientName: form.patientName,
        patientMobile: form.patientMobile,
        patientEmail: form.patientEmail || undefined,
        patientAge: form.patientAge ? Number(form.patientAge) : undefined,
        patientGender: form.patientGender || undefined,
        collectionDate: new Date(form.collectionDate).toISOString(),
        timeSlot: form.timeSlot,
        address: {
          line1: form.addressLine1,
          city: form.city,
          pincode: form.pincode,
          landmark: form.landmark || undefined,
        },
        notes: form.notes || undefined,
        paymentMethod: form.paymentMethod,
        isQuickBook,
      };

      const res = await bookingAPI.create(payload);
      onSuccess?.(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {error && <div className="alert alert-error">{error}</div>}

      <h3>Patient Details</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            required
            value={form.patientName}
            onChange={(e) => update('patientName', e.target.value)}
            placeholder="Patient full name"
          />
        </div>
        <div className="form-group">
          <label>Mobile *</label>
          <input
            required
            type="tel"
            value={form.patientMobile}
            onChange={(e) => update('patientMobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile"
            maxLength={10}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.patientEmail}
            onChange={(e) => update('patientEmail', e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            min="1"
            max="120"
            value={form.patientAge}
            onChange={(e) => update('patientAge', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Gender</label>
        <select value={form.patientGender} onChange={(e) => update('patientGender', e.target.value)}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <h3>Sample Collection</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Collection Date *</label>
          <input
            required
            type="date"
            min={minDate}
            value={form.collectionDate}
            onChange={(e) => update('collectionDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Time Slot *</label>
          <select value={form.timeSlot} onChange={(e) => update('timeSlot', e.target.value)}>
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Address *</label>
        <input
          required
          value={form.addressLine1}
          onChange={(e) => update('addressLine1', e.target.value)}
          placeholder="House no., street, area"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City *</label>
          <input
            required
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="City"
          />
        </div>
        <div className="form-group">
          <label>Pincode *</label>
          <input
            required
            value={form.pincode}
            onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit pincode"
            maxLength={6}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Landmark</label>
        <input
          value={form.landmark}
          onChange={(e) => update('landmark', e.target.value)}
          placeholder="Near..."
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Any special instructions"
        />
      </div>

      <div className="form-group">
        <label>Payment Method</label>
        <select value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
          <option value="cod">Cash on Collection (COD)</option>
          <option value="online">Pay Online (Demo)</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
