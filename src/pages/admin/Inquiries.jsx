import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';

const STATUS_OPTIONS = ['new', 'read', 'replied', 'closed'];

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('new');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI
      .getInquiries(filter ? { status: filter } : {})
      .then((res) => setInquiries(res.data.inquiries))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const openInquiry = (inq) => {
    setSelected(inq);
    setNotes(inq.adminNotes || '');
    setStatus(inq.status);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await adminAPI.updateInquiry(selected._id, { status, adminNotes: notes });
      setSelected(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    await adminAPI.deleteInquiry(id);
    if (selected?._id === id) setSelected(null);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Inquiries</h1>
        <p>Manage customer contact form submissions</p>
      </div>

      <div className="admin-card" style={{ marginBottom: '1rem' }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading inquiries...</div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No inquiries yet</td></tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq._id}>
                    <td><strong>{inq.name}</strong></td>
                    <td>{inq.mobile}</td>
                    <td>{inq.subject}</td>
                    <td><span className={`status-badge status-${inq.status}`}>{inq.status}</span></td>
                    <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="btn-admin-sm btn-admin-view" onClick={() => openInquiry(inq)}>View</button>
                        <button type="button" className="btn-admin-sm btn-admin-delete" onClick={() => handleDelete(inq._id)}>Delete</button>
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
            <h2>{selected.subject}</h2>
            <p><strong>From:</strong> {selected.name} · {selected.mobile} {selected.email && `· ${selected.email}`}</p>
            <p className="inquiry-message">{selected.message}</p>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Admin Notes</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes..." />
            </div>
            <div className="admin-actions">
              <button type="button" className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
