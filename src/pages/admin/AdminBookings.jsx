import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';
import './adminExtras.css';

const STATUS_OPTIONS = ['booked', 'sample_collected', 'processing', 'report_ready', 'cancelled'];
const PAYMENT_OPTIONS = ['pending', 'paid', 'failed', 'refunded'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: 'booked', paymentStatus: 'pending', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI
      .getBookings({
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(q.trim() ? { q: q.trim() } : {}),
      })
      .then((res) => setBookings(res.data.bookings || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [status, paymentStatus]);

  const submitSearch = (e) => {
    e.preventDefault();
    load();
  };

  const openBooking = (booking) => {
    setSelected(booking);
    setForm({
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes || '',
    });
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await adminAPI.updateBooking(selected._id, form);
      setSelected(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await adminAPI.deleteBooking(id);
    if (selected?._id === id) setSelected(null);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Bookings</h1>
        <p>Track home collection orders, status, and payments</p>
      </div>

      <div className="admin-card admin-filters-row">
        <form className="filter-search-field" onSubmit={submitSearch} role="search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order / name / mobile"
            className="filter-search"
            aria-label="Search bookings"
          />
          <button type="submit" className="filter-search-btn" aria-label="Search bookings">
            <Search size={15} strokeWidth={2.5} aria-hidden="true" />
            <span>Search</span>
          </button>
        </form>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="filter-select">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="filter-select">
          <option value="">All payments</option>
          {PAYMENT_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading bookings...</div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Patient</th>
                <th>Collection</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <strong>{b.orderId}</strong>
                      <br />
                      <small>{new Date(b.createdAt).toLocaleString()}</small>
                    </td>
                    <td>
                      {b.patientName}
                      <br />
                      <small>{b.patientMobile}</small>
                    </td>
                    <td>
                      {new Date(b.collectionDate).toLocaleDateString()}
                      <br />
                      <small>{b.timeSlot}</small>
                    </td>
                    <td>₹{b.totalAmount}</td>
                    <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                    <td><span className={`status-badge status-${b.paymentStatus}`}>{b.paymentStatus}</span></td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="btn-admin-sm btn-admin-view" onClick={() => openBooking(b)}>
                          Manage
                        </button>
                        <button type="button" className="btn-admin-sm btn-admin-delete" onClick={() => handleDelete(b._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.orderId}</h2>
            <p>
              <strong>{selected.patientName}</strong> · {selected.patientMobile}
              {selected.patientEmail ? ` · ${selected.patientEmail}` : ''}
            </p>
            <p>
              {selected.address?.line1}, {selected.address?.city} — {selected.address?.pincode}
            </p>
            <ul style={{ margin: '0.75rem 0 1rem', paddingLeft: '1.1rem' }}>
              {selected.items?.map((item, idx) => (
                <li key={`${item.itemId}-${idx}`}>
                  {item.name} · ₹{item.price}
                </li>
              ))}
            </ul>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Payment</label>
              <select
                value={form.paymentStatus}
                onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value }))}
              >
                {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div className="admin-actions">
              <button type="button" className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
