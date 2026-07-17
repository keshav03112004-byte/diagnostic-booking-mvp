import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';

export default function Profile() {
  const { user, isAuthenticated, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || '',
      });
    }
  }, [user]);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    line1: '',
    city: '',
    pincode: '',
    landmark: '',
    isDefault: true,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (loading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateAddress = (field, value) => setAddressForm((prev) => ({ ...prev, [field]: value }));

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await authAPI.updateProfile({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setUser(res.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await authAPI.addAddress(addressForm);
      setUser(res.data.user);
      setMessage('Address added successfully');
      setAddressForm({ label: 'Home', line1: '', city: '', pincode: '', landmark: '', isDefault: false });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add address');
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account details and saved addresses</p>
        </div>
      </div>

      <div className="container section">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="profile-grid">
          <div className="card">
            <h2>Personal Details</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input value={user.mobile} disabled />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" value={form.age} onChange={(e) => update('age', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save Profile</button>
            </form>
          </div>

          <div className="card">
            <h2>Saved Addresses</h2>
            {user.addresses?.length > 0 ? (
              <ul className="address-list">
                {user.addresses.map((addr, idx) => (
                  <li key={idx}>
                    <strong>{addr.label}</strong>
                    {addr.isDefault && <span className="badge badge-primary">Default</span>}
                    <p>{addr.line1}, {addr.city} - {addr.pincode}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No saved addresses yet.</p>
            )}

            <h3 style={{ marginTop: '1.5rem' }}>Add Address</h3>
            <form onSubmit={handleAddAddress}>
              <div className="form-group">
                <label>Label</label>
                <input value={addressForm.label} onChange={(e) => updateAddress('label', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input required value={addressForm.line1} onChange={(e) => updateAddress('line1', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input required value={addressForm.city} onChange={(e) => updateAddress('city', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input required value={addressForm.pincode} onChange={(e) => updateAddress('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} />
                </div>
              </div>
              <button type="submit" className="btn btn-outline">Add Address</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
