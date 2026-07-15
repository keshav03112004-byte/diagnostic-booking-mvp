import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';
import './adminExtras.css';

const EMPTY = { name: '', description: '', icon: '🩺', isActive: true };

export default function AdminDiseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI
      .getDiseases()
      .then((res) => setDiseases(res.data.diseases || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing('new');
    setForm(EMPTY);
  };

  const openEdit = (disease) => {
    setEditing(disease._id);
    setForm({
      name: disease.name || '',
      description: disease.description || '',
      icon: disease.icon || '🩺',
      isActive: disease.isActive !== false,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing === 'new') {
        await adminAPI.createDisease(form);
      } else {
        await adminAPI.updateDisease(editing, form);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save disease');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete disease "${name}"?`)) return;
    await adminAPI.deleteDisease(id);
    if (editing === id) setEditing(null);
    load();
  };

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Diseases / Concerns</h1>
          <p>Manage the browse-by-concern catalog shown on the website</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Add Disease
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading diseases...</div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((d) => (
                <tr key={d._id}>
                  <td style={{ fontSize: '1.4rem' }}>{d.icon}</td>
                  <td><strong>{d.name}</strong></td>
                  <td>{d.slug}</td>
                  <td>
                    <span className={`status-badge ${d.isActive ? 'status-replied' : 'status-closed'}`}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="btn-admin-sm btn-admin-edit" onClick={() => openEdit(d)}>
                        Edit
                      </button>
                      <button type="button" className="btn-admin-sm btn-admin-delete" onClick={() => handleDelete(d._id, d.name)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="admin-modal-overlay" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing === 'new' ? 'Add Disease' : 'Edit Disease'}</h2>
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active
            </label>
            <div className="admin-actions">
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
