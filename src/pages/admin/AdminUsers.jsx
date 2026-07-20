import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';
import './adminExtras.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI
      .getUsers({
        ...(role ? { role } : {}),
        ...(q.trim() ? { q: q.trim() } : {}),
      })
      .then((res) => setUsers(res.data.users || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [role]);

  const submitSearch = (e) => {
    e.preventDefault();
    load();
  };

  const openUser = async (user) => {
    setSelected(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
    });
    const res = await adminAPI.getUser(user._id);
    setSelected(res.data.user);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await adminAPI.updateUser(selected._id, form);
      setSelected(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Users</h1>
        <p>Manage customer accounts and admin access</p>
      </div>

      <div className="admin-card admin-filters-row">
        <form className="filter-search-field" onSubmit={submitSearch} role="search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / mobile / email"
            className="filter-search"
            aria-label="Search users"
          />
          <button type="submit" className="filter-search-btn" aria-label="Search users">
            <Search size={15} strokeWidth={2.5} aria-hidden="true" />
            <span>Search</span>
          </button>
        </form>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="filter-select">
          <option value="">All roles</option>
          <option value="user">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.mobile}</td>
                  <td>{user.email || '—'}</td>
                  <td><span className={`status-badge status-${user.role === 'admin' ? 'replied' : 'new'}`}>{user.role}</span></td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button type="button" className="btn-admin-sm btn-admin-view" onClick={() => openUser(user)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.name}</h2>
            <p>{selected.mobile}{selected.email ? ` · ${selected.email}` : ''}</p>
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <p className="admin-user-wa-note">
              Customer bookings and inquiries are managed on WhatsApp Business, not in this panel.
            </p>
            <div className="admin-actions" style={{ marginTop: '1rem' }}>
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
