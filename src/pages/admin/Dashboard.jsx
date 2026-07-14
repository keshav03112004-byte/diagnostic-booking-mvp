import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getDashboard()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Overview of your DiagBook platform</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <strong>{stats?.tests || 0}</strong>
          <span>Total Tests</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.packages || 0}</strong>
          <span>Total Packages</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.inquiries || 0}</strong>
          <span>Total Inquiries</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.newInquiries || 0}</strong>
          <span>New Inquiries</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.bookings || 0}</strong>
          <span>Total Bookings</span>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/inquiries" className="btn btn-secondary">View Inquiries</Link>
          <Link to="/admin/tests" className="btn btn-primary">Manage Tests</Link>
          <Link to="/admin/packages" className="btn btn-primary">Manage Packages</Link>
          <Link to="/admin/packages/new" className="btn btn-primary">Add New Package</Link>
          <Link to="/admin/cms/hero" className="btn btn-secondary">Edit Hero Section</Link>
        </div>
      </div>
    </div>
  );
}
