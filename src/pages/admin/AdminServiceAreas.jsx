import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';
import './adminExtras.css';

export default function AdminServiceAreas() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    adminAPI
      .getServiceAreas()
      .then((res) => {
        const list = res.data.pincodes || [];
        setText(list.join('\n'));
        setCount(list.length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const pincodes = text
        .split(/[\n,\s]+/)
        .map((p) => p.trim())
        .filter(Boolean);
      const res = await adminAPI.updateServiceAreas({ pincodes });
      setText((res.data.pincodes || []).join('\n'));
      setCount(res.data.count || 0);
      setMessage(`Saved ${res.data.count || 0} serviceable pincodes.`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save pincodes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading service areas...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Service Areas</h1>
        <p>Manage 6-digit pincodes where home collection is available ({count} active)</p>
      </div>

      <div className="admin-card">
        {message ? <div className="alert alert-success">{message}</div> : null}
        <div className="form-group">
          <label>Pincodes (one per line or comma-separated)</label>
          <textarea
            rows={16}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="122001&#10;110001&#10;560001"
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Pincodes'}
        </button>
      </div>
    </div>
  );
}
