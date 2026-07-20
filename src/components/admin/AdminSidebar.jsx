import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';
import './AdminSidebar.css';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/tests', label: 'Tests', icon: '🧪' },
  { to: '/admin/packages', label: 'Packages', icon: '📦' },
  { to: '/admin/diseases', label: 'Diseases', icon: '🩺' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
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
        <div className="admin-sidebar-logo-wrap">
          <Logo height={40} />
        </div>
        <div className="admin-sidebar-brand-copy">
          <strong>energex.life</strong>
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
            <span>{user?.username || user?.mobile}</span>
          </div>
        </div>
        <a href="http://localhost:5173/" target="_blank" rel="noreferrer" className="admin-view-site">
          View Website →
        </a>
        <button type="button" onClick={handleLogout} className="admin-logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
}
