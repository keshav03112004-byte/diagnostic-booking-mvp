import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../api/api';
import './AdminLayout.css';

const DISEASE_OPTIONS = [
  'diabetes', 'thyroid', 'heart', 'liver', 'kidney', 'vitamins', 'anaemia', 'pregnancy', 'fever', 'arthritis',
];

const EMPTY = {
  name: '',
  description: '',
  overview: '',
  price: '',
  originalPrice: '',
  sampleType: 'Blood',
  fastingRequired: false,
  fastingHours: 0,
  reportTatHours: 24,
  preparation: '',
  recommendedFor: 'Everyone',
  gender: 'Male & Female',
  parameters: '',
  diseaseCategories: [],
  isPopular: false,
  isActive: true,
  whyTakeTest: '',
  whenToTake: '',
};

export default function TestForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    adminAPI.getTests().then((res) => {
      const test = res.data.tests.find((t) => t._id === id);
      if (test) {
        setForm({
          ...test,
          price: test.price,
          originalPrice: test.originalPrice || '',
          parameters: (test.parameters || []).join(', '),
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleDisease = (slug) => {
    setForm((f) => ({
      ...f,
      diseaseCategories: f.diseaseCategories.includes(slug)
        ? f.diseaseCategories.filter((d) => d !== slug)
        : [...f.diseaseCategories, slug],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      parameters: form.parameters
        ? form.parameters.split(',').map((p) => p.trim()).filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await adminAPI.updateTest(id, payload);
      } else {
        await adminAPI.createTest(payload);
      }
      navigate('/admin/tests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save test');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading test...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit Test' : 'Add New Test'}</h1>
        <p>{isEdit ? 'Update test details' : 'Create a new diagnostic test'}</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-card admin-form-grid">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="admin-form-grid two-col">
          <div className="form-group">
            <label>Test Name *</label>
            <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Complete Hemogram (CBC)" />
          </div>
          <div className="form-group">
            <label>Price (₹) *</label>
            <input required type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} />
          </div>
        </div>

        <div className="admin-form-grid two-col">
          <div className="form-group">
            <label>Original Price (₹)</label>
            <input type="number" min="0" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} placeholder="For strikethrough display" />
          </div>
          <div className="form-group">
            <label>Sample Type</label>
            <select value={form.sampleType} onChange={(e) => set('sampleType', e.target.value)}>
              <option>Blood</option>
              <option>Urine</option>
              <option>Stool</option>
              <option>Swab</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Short Description *</label>
          <textarea required rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Overview (detail page)</label>
          <textarea rows={4} value={form.overview} onChange={(e) => set('overview', e.target.value)} />
        </div>

        <div className="admin-form-grid two-col">
          <div className="form-group">
            <label>Report TAT (hours)</label>
            <input type="number" min="1" value={form.reportTatHours} onChange={(e) => set('reportTatHours', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Recommended For</label>
            <input value={form.recommendedFor} onChange={(e) => set('recommendedFor', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Parameters (comma-separated)</label>
          <input value={form.parameters} onChange={(e) => set('parameters', e.target.value)} placeholder="Hb, RBC, WBC, Platelet Count" />
        </div>

        <div className="form-group">
          <label>Health Categories</label>
          <div className="disease-checkboxes">
            {DISEASE_OPTIONS.map((slug) => (
              <label key={slug} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.diseaseCategories.includes(slug)}
                  onChange={() => toggleDisease(slug)}
                />
                {slug.charAt(0).toUpperCase() + slug.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="admin-form-grid two-col">
          <label className="checkbox-label">
            <input type="checkbox" checked={form.fastingRequired} onChange={(e) => set('fastingRequired', e.target.checked)} />
            Fasting Required
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.isPopular} onChange={(e) => set('isPopular', e.target.checked)} />
            Mark as Popular
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
            Active (visible on site)
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Test' : 'Create Test'}
          </button>
          <Link to="/admin/tests" className="btn btn-hero-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
