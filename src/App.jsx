import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';
import Home from './pages/Home';
import BookInquiryRedirect from './pages/BookInquiryRedirect';
import Tests from './pages/Tests';
import TestDetail from './pages/TestDetail';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import DiseaseDetail from './pages/DiseaseDetail';
import QuickBook from './pages/QuickBook';
import Checkout from './pages/Checkout';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
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

function PublicApp() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<BookInquiryRedirect />} />
          <Route path="/register" element={<BookInquiryRedirect />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/tests/:slug" element={<TestDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />
          <Route path="/disease/:slug" element={<DiseaseDetail />} />
          <Route path="/book/quick" element={<QuickBook />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <InquiryModal />
    </div>
  );
}

export default function App() {
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
      </Route>
      <Route path="/*" element={<PublicApp />} />
    </Routes>
  );
}
