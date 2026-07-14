import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI
      .getPackages()
      .then((res) => setPackages(res.data.packages))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete package "${name}"? This cannot be undone.`)) return;
    await adminAPI.deletePackage(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Packages</h1>
          <p>Add, edit, or delete health packages</p>
        </div>
        <Link to="/admin/packages/new" className="btn btn-primary">+ Add Package</Link>
      </div>

      {loading ? (
        <div className="admin-loading">Loading packages...</div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Tests</th>
                <th>Popular</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No packages yet</td></tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td>
                      <strong>{pkg.name}</strong>
                      <br />
                      <small style={{ color: 'var(--text-muted)' }}>{pkg.slug}</small>
                    </td>
                    <td>₹{pkg.price}</td>
                    <td>{pkg.tests?.length || pkg.totalTestsCount || 0} tests</td>
                    <td>{pkg.isPopular ? '⭐' : '—'}</td>
                    <td>
                      <span className={`status-badge ${pkg.isActive ? 'status-replied' : 'status-closed'}`}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/packages/${pkg._id}/edit`} className="btn-admin-sm btn-admin-edit">Edit</Link>
                        <button type="button" className="btn-admin-sm btn-admin-delete" onClick={() => handleDelete(pkg._id, pkg.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
