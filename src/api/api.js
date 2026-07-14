import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  addAddress: (data) => api.post('/auth/addresses', data),
};

export const testAPI = {
  getAll: (params) => api.get('/tests', { params }),
  getPopular: () => api.get('/tests/popular'),
  getBySlug: (slug) => api.get(`/tests/${slug}`),
};

export const packageAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getPopular: () => api.get('/packages/popular'),
  getBySlug: (slug) => api.get(`/packages/${slug}`),
};

export const diseaseAPI = {
  getAll: () => api.get('/diseases'),
  getBySlug: (slug) => api.get(`/diseases/${slug}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  checkPincode: (pincode) => api.get(`/bookings/pincode/${pincode}`),
};

export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
};

export const cmsAPI = {
  getHero: () => api.get('/cms/hero'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getInquiries: (params) => api.get('/admin/inquiries', { params }),
  getInquiry: (id) => api.get(`/admin/inquiries/${id}`),
  updateInquiry: (id, data) => api.patch(`/admin/inquiries/${id}`, data),
  deleteInquiry: (id) => api.delete(`/admin/inquiries/${id}`),
  getTests: () => api.get('/admin/tests'),
  createTest: (data) => api.post('/admin/tests', data),
  updateTest: (id, data) => api.put(`/admin/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/admin/tests/${id}`),
  getPackages: () => api.get('/admin/packages'),
  getPackage: (id) => api.get(`/admin/packages/${id}`),
  createPackage: (data) => api.post('/admin/packages', data),
  updatePackage: (id, data) => api.put(`/admin/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/admin/packages/${id}`),
  getHeroSettings: () => api.get('/admin/cms/settings'),
  updateHero: (data) => api.put('/admin/cms/hero', data),
  uploadMedia: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/cms/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  generateVideo: (data) => api.post('/admin/cms/generate-video', data),
};

export const mediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};

export default api;
