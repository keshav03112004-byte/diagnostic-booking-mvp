import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI
      .getTests()
      .then((res) => setTests(res.data.tests))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete test "${name}"? This cannot be undone.`)) return;
    await adminAPI.deleteTest(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Tests</h1>
          <p>Add, edit, or delete diagnostic tests</p>
        </div>
        <Link to="/admin/tests/new" className="btn btn-primary">+ Add Test</Link>
      </div>

      {loading ? (
        <div className="admin-loading">Loading tests...</div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Sample</th>
                <th>Popular</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test._id}>
                  <td>
                    <strong>{test.name}</strong>
                    <br />
                    <small style={{ color: 'var(--text-muted)' }}>{test.slug}</small>
                  </td>
                  <td>₹{test.price}</td>
                  <td>{test.sampleType}</td>
                  <td>{test.isPopular ? '⭐' : '—'}</td>
                  <td>
                    <span className={`status-badge ${test.isActive ? 'status-replied' : 'status-closed'}`}>
                      {test.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/admin/tests/${test._id}/edit`} className="btn-admin-sm btn-admin-edit">Edit</Link>
                      <button type="button" className="btn-admin-sm btn-admin-delete" onClick={() => handleDelete(test._id, test.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
