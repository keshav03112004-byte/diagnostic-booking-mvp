import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: '💬' },
  { to: '/admin/tests', label: 'Tests', icon: '🧪' },
  { to: '/admin/packages', label: 'Packages', icon: '📦' },
  { to: '/admin/cms/hero', label: 'Hero CMS', icon: '🎬' },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-logo">D</span>
        <div>
          <strong>DiagBook</strong>
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="admin-nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user">
          <span className="admin-user-avatar">A</span>
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.mobile}</span>
          </div>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
          View Website →
        </a>
        <button type="button" onClick={handleLogout} className="admin-logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
}
