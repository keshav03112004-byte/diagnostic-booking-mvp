import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Inquiries from './pages/admin/Inquiries';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDiseases from './pages/admin/AdminDiseases';
import AdminServiceAreas from './pages/admin/AdminServiceAreas';
import AdminTests from './pages/admin/AdminTests';
import TestForm from './pages/admin/TestForm';
import AdminPackages from './pages/admin/AdminPackages';
import PackageForm from './pages/admin/PackageForm';
import HeroCMS from './pages/admin/HeroCMS';

/** Admin-only router used by the port-5180 Vite server. */
export default function AdminApp() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="diseases" element={<AdminDiseases />} />
        <Route path="service-areas" element={<AdminServiceAreas />} />
        <Route path="tests" element={<AdminTests />} />
        <Route path="tests/new" element={<TestForm />} />
        <Route path="tests/:id/edit" element={<TestForm />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="packages/new" element={<PackageForm />} />
        <Route path="packages/:id/edit" element={<PackageForm />} />
        <Route path="cms/hero" element={<HeroCMS />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
