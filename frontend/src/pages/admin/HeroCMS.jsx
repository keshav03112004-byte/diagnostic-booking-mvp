import { useEffect, useState } from 'react';
import { adminAPI, mediaUrl } from '../../api/api';
import './AdminLayout.css';

export default function HeroCMS() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminAPI
      .getHeroSettings()
      .then((res) => setForm(res.data.settings))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setVideo = (key, value) => setForm((f) => ({ ...f, heroVideo: { ...f.heroVideo, [key]: value } }));

  const handleUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminAPI.uploadMedia(file);
      const url = mediaUrl(res.data.url);
      if (field === 'src') setVideo('src', url);
      else setVideo('poster', url);
      setMessage('File uploaded successfully');
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateStat = (index, key, value) => {
    setForm((f) => {
      const stats = [...(f.heroStats || [])];
      stats[index] = { ...stats[index], [key]: value };
      return { ...f, heroStats: stats };
    });
  };

  const addStat = () => {
    setForm((f) => ({ ...f, heroStats: [...(f.heroStats || []), { value: '', label: '' }] }));
  };

  const removeStat = (index) => {
    setForm((f) => ({ ...f, heroStats: f.heroStats.filter((_, i) => i !== index) }));
  };

  const updateTag = (index, value) => {
    setForm((f) => {
      const tags = [...(f.heroTags || [])];
      tags[index] = value;
      return { ...f, heroTags: tags };
    });
  };

  const addTag = () => setForm((f) => ({ ...f, heroTags: [...(f.heroTags || []), ''] }));
  const removeTag = (index) => setForm((f) => ({ ...f, heroTags: f.heroTags.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await adminAPI.updateHero({
        siteName: form.siteName,
        badge: form.badge,
        tagline: form.tagline,
        taglineHighlight: form.taglineHighlight,
        description: form.description,
        heroVideo: form.heroVideo,
        heroStats: form.heroStats.filter((s) => s.value && s.label),
        heroTags: form.heroTags.filter(Boolean),
      });
      setMessage('Hero section updated successfully!');
    } catch {
      setMessage('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <div className="admin-loading">Loading CMS...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Hero Section CMS</h1>
        <p>Edit homepage hero text, stats, tags, and background video</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form-grid" style={{ gap: '1.5rem' }}>
        <div className="admin-card admin-form-grid">
          <h3>Text Content</h3>
          <div className="form-group">
            <label>Badge Text</label>
            <input value={form.badge} onChange={(e) => set('badge', e.target.value)} />
          </div>
          <div className="admin-form-grid two-col">
            <div className="form-group">
              <label>Tagline (line 1)</label>
              <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tagline Highlight (line 2)</label>
              <input value={form.taglineHighlight} onChange={(e) => set('taglineHighlight', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
        </div>

        <div className="admin-card admin-form-grid">
          <h3>Background Video</h3>
          <div className="form-group">
            <label>Video URL</label>
            <input value={form.heroVideo?.src || ''} onChange={(e) => setVideo('src', e.target.value)} placeholder="https://... or /uploads/videos/..." />
          </div>
          <div className="form-group">
            <label>Upload Video File</label>
            <input type="file" accept="video/*" onChange={(e) => handleUpload(e, 'src')} disabled={uploading} />
          </div>
          <div className="form-group">
            <label>Poster Image URL</label>
            <input value={form.heroVideo?.poster || ''} onChange={(e) => setVideo('poster', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Upload Poster Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'poster')} disabled={uploading} />
          </div>
          <div className="form-group">
            <label>Video Caption (accessibility)</label>
            <input value={form.heroVideo?.caption || ''} onChange={(e) => setVideo('caption', e.target.value)} />
          </div>
          {form.heroVideo?.src && (
            <div className="cms-video-preview">
              <video src={mediaUrl(form.heroVideo.src)} muted loop playsInline controls style={{ maxWidth: '100%', borderRadius: '12px' }} />
            </div>
          )}
        </div>

        <div className="admin-card admin-form-grid">
          <h3>Hero Stats</h3>
          {(form.heroStats || []).map((stat, i) => (
            <div key={i} className="admin-form-grid two-col" style={{ alignItems: 'end' }}>
              <div className="form-group">
                <label>Value</label>
                <input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="13+" />
              </div>
              <div className="form-group">
                <label>Label</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Lab Tests" style={{ flex: 1 }} />
                  <button type="button" className="btn-admin-sm btn-admin-delete" onClick={() => removeStat(i)}>✕</button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-hero-outline" onClick={addStat}>+ Add Stat</button>
        </div>

        <div className="admin-card admin-form-grid">
          <h3>Hero Tags</h3>
          {(form.heroTags || []).map((tag, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={tag} onChange={(e) => updateTag(i, e.target.value)} style={{ flex: 1 }} />
              <button type="button" className="btn-admin-sm btn-admin-delete" onClick={() => removeTag(i)}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-hero-outline" onClick={addTag}>+ Add Tag</button>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving || uploading} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Saving...' : 'Save Hero Content'}
        </button>
      </form>
    </div>
  );
}
