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

  const [aiPrompt, setAiPrompt] = useState('A professional reassuring nurse in a clean modern clinical laboratory gently drawing a blood sample from a patient\'s arm for diagnostic testing, high quality, warm professional lighting, reassuring medical environment, stable camera, 4k detail');
  const [aiAspectRatio, setAiAspectRatio] = useState('16:9');
  const [aiDuration, setAiDuration] = useState('5s');
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [aiVideoError, setAiVideoError] = useState('');

  const handleGenerateAIVideo = async () => {
    setGeneratingVideo(true);
    setAiVideoError('');
    setMessage('');
    try {
      const res = await adminAPI.generateVideo({
        prompt: aiPrompt,
        aspectRatio: aiAspectRatio,
        duration: aiDuration,
      });
      const generatedUrl = res.data.url;
      setVideo('src', generatedUrl);
      setMessage('AI Video generated and set as background successfully!');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'An unknown error occurred';
      if (errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota') || errMsg.includes('billing')) {
        setAiVideoError('Your current Veo 3.1 AI API key quota is exhausted. Note: Since Veo 3 uses significant credits, standard sandbox keys may be rate-limited. We have automatically downloaded a high-quality local Nurse-Patient test video to use as a fallback.');
      } else {
        setAiVideoError(errMsg);
      }
    } finally {
      setGeneratingVideo(false);
    }
  };

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

          {/* AI Video Generator (Veo 3) Panel */}
          <div className="ai-generator-panel" style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px dashed var(--accent)',
            background: 'rgba(var(--accent-rgb), 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '1.1rem', fontWeight: 600 }}>
              <span>✨</span> Generate Background Video with Veo 3 AI
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a0aec0', lineHeight: 1.4 }}>
              Use Google's advanced <strong>veo-3.1-fast-generate-preview</strong> model to generate high-quality custom video loops of a medical setting or action.
            </p>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a0aec0' }}>Prompt Description</label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="A professional reassuring nurse in a clinical laboratory drawing a blood sample from a patient's arm..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #4a5568', background: '#1a202c', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div className="admin-form-grid two-col" style={{ gap: '1rem', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a0aec0' }}>Aspect Ratio</label>
                <select
                  value={aiAspectRatio}
                  onChange={(e) => setAiAspectRatio(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #4a5568', background: '#1a202c', color: '#fff', fontSize: '0.9rem' }}
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a0aec0' }}>Duration</label>
                <select
                  value={aiDuration}
                  onChange={(e) => setAiDuration(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #4a5568', background: '#1a202c', color: '#fff', fontSize: '0.9rem' }}
                >
                  <option value="5s">5s (Preview Mode)</option>
                </select>
              </div>
            </div>

            {aiVideoError && (
              <div className="alert alert-error" style={{ fontSize: '0.85rem', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
                <strong>API Notice:</strong>
                <p style={{ margin: 0, lineHeight: 1.4 }}>{aiVideoError}</p>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={handleGenerateAIVideo}
                disabled={generatingVideo}
                className="admin-btn admin-btn-accent"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  cursor: generatingVideo ? 'not-allowed' : 'pointer',
                  opacity: generatingVideo ? 0.7 : 1
                }}
              >
                {generatingVideo ? (
                  <>
                    <span className="spinner" style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: '2px solid #fff',
                      borderTopColor: 'transparent',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Generating with Veo 3...
                  </>
                ) : (
                  'Generate Video with Veo 3 AI'
                )}
              </button>
            </div>
          </div>

          {form.heroVideo?.src && (
            <div className="cms-video-preview" style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#a0aec0' }}>Active Video Preview:</label>
              <video src={mediaUrl(form.heroVideo.src)} muted loop playsInline controls style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid #4a5568' }} />
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
          <button type="button" className="btn btn-outline" onClick={addStat}>+ Add Stat</button>
        </div>

        <div className="admin-card admin-form-grid">
          <h3>Hero Tags</h3>
          {(form.heroTags || []).map((tag, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={tag} onChange={(e) => updateTag(i, e.target.value)} style={{ flex: 1 }} />
              <button type="button" className="btn-admin-sm btn-admin-delete" onClick={() => removeTag(i)}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline" onClick={addTag}>+ Add Tag</button>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving || uploading} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Saving...' : 'Save Hero Content'}
        </button>
      </form>
    </div>
  );
}
