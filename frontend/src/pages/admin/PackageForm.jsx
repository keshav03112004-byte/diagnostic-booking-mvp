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
  testIds: [],
  benefits: '',
  highlights: '',
  fastingRequired: false,
  fastingHours: 0,
  reportTatHours: 24,
  preparation: '',
  recommendedFor: 'Everyone',
  gender: 'Male & Female',
  diseaseCategories: [],
  isPopular: false,
  isActive: true,
};

export default function PackageForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [allTests, setAllTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTests = adminAPI.getTests().then((res) => setAllTests(res.data.tests));

    if (!isEdit) {
      loadTests.finally(() => setLoading(false));
      return;
    }

    Promise.all([loadTests, adminAPI.getPackage(id)])
      .then(([, pkgRes]) => {
        const pkg = pkgRes.data.package;
        setForm({
          name: pkg.name,
          description: pkg.description,
          overview: pkg.overview || '',
          price: pkg.price,
          originalPrice: pkg.originalPrice || '',
          testIds: (pkg.tests || []).map((t) => (typeof t === 'object' ? t._id : t)),
          benefits: (pkg.benefits || []).join('\n'),
          highlights: (pkg.highlights || []).join('\n'),
          fastingRequired: pkg.fastingRequired,
          fastingHours: pkg.fastingHours || 0,
          reportTatHours: pkg.reportTatHours || 24,
          preparation: pkg.preparation || '',
          recommendedFor: pkg.recommendedFor || 'Everyone',
          gender: pkg.gender || 'Male & Female',
          diseaseCategories: pkg.diseaseCategories || [],
          isPopular: pkg.isPopular,
          isActive: pkg.isActive,
        });
      })
      .finally(() => setLoading(false));
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

  const toggleTest = (testId) => {
    setForm((f) => ({
      ...f,
      testIds: f.testIds.includes(testId)
        ? f.testIds.filter((t) => t !== testId)
        : [...f.testIds, testId],
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
      benefits: form.benefits ? form.benefits.split('\n').map((b) => b.trim()).filter(Boolean) : [],
      highlights: form.highlights ? form.highlights.split('\n').map((h) => h.trim()).filter(Boolean) : [],
      testIds: form.testIds,
    };

    try {
      if (isEdit) {
        await adminAPI.updatePackage(id, payload);
      } else {
        await adminAPI.createPackage(payload);
      }
      navigate('/admin/packages');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading package...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit Package' : 'Add New Package'}</h1>
        <p>{isEdit ? 'Update package details and included tests' : 'Create a new health package'}</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-card admin-form-grid">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="admin-form-grid two-col">
          <div className="form-group">
            <label>Package Name *</label>
            <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Basic Health Checkup" />
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
            <label>Report TAT (hours)</label>
            <input type="number" min="1" value={form.reportTatHours} onChange={(e) => set('reportTatHours', Number(e.target.value))} />
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

        <div className="form-group">
          <label>Included Tests * ({form.testIds.length} selected)</label>
          <div className="test-select-grid">
            {allTests.map((test) => (
              <label key={test._id} className="checkbox-label test-select-item">
                <input
                  type="checkbox"
                  checked={form.testIds.includes(test._id)}
                  onChange={() => toggleTest(test._id)}
                />
                <span>
                  <strong>{test.name}</strong>
                  <small>₹{test.price}</small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Benefits (one per line)</label>
          <textarea rows={4} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} placeholder="Complete overview of vital organ health&#10;Early detection of diabetes..." />
        </div>

        <div className="form-group">
          <label>Highlights (one per line)</label>
          <textarea rows={3} value={form.highlights} onChange={(e) => set('highlights', e.target.value)} placeholder="6 essential tests&#10;18-hour report delivery" />
        </div>

        <div className="form-group">
          <label>Preparation Instructions</label>
          <textarea rows={2} value={form.preparation} onChange={(e) => set('preparation', e.target.value)} />
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
            {saving ? 'Saving...' : isEdit ? 'Update Package' : 'Create Package'}
          </button>
          <Link to="/admin/packages" className="btn btn-hero-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
