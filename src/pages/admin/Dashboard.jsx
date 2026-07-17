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
        <p>Operations overview for energex.life</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <strong>{stats?.bookings || 0}</strong>
          <span>Total Bookings</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.bookedToday || 0}</strong>
          <span>Bookings Today</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.pendingPayments || 0}</strong>
          <span>Pending Payments</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.newInquiries || 0}</strong>
          <span>New Inquiries</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.users || 0}</strong>
          <span>Customers</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.tests || 0}</strong>
          <span>Tests</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.packages || 0}</strong>
          <span>Packages</span>
        </div>
        <div className="admin-stat-card">
          <strong>{stats?.diseases || 0}</strong>
          <span>Diseases</span>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/bookings" className="btn btn-primary">Manage Bookings</Link>
          <Link to="/admin/inquiries" className="btn btn-secondary">View Inquiries</Link>
          <Link to="/admin/users" className="btn btn-secondary">Manage Users</Link>
          <Link to="/admin/tests" className="btn btn-primary">Manage Tests</Link>
          <Link to="/admin/packages" className="btn btn-primary">Manage Packages</Link>
          <Link to="/admin/diseases" className="btn btn-secondary">Manage Diseases</Link>
          <Link to="/admin/service-areas" className="btn btn-secondary">Service Areas</Link>
        </div>
      </div>
    </div>
  );
}
