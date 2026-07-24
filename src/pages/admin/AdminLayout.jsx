import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Seo from '../../components/Seo';
import { pageSeo } from '../../config/seo';
import './AdminLayout.css';
import './adminExtras.css';

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Seo {...pageSeo.admin} title="Admin" />
        <div className="admin-loading">Loading admin panel...</div>
      </>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Seo {...pageSeo.admin} title="Admin Dashboard" />
      <AdminSidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
