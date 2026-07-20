import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Package,
  Stethoscope,
  Users,
  ArrowUpRight,
  AlertCircle,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api/api';
import WhatsAppIcon from '../../components/WhatsAppIcon';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import './AdminLayout.css';
import './Dashboard.css';

const WHATSAPP_BUSINESS_URL = getWhatsAppUrl(
  'Opening WhatsApp Business for energex.life customer conversations.'
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI
      .getDashboard()
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard data. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    []
  );

  const catalogCards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: 'Lab tests',
        value: stats.tests || 0,
        meta: 'Editable catalog items',
        to: '/admin/tests',
        Icon: FlaskConical,
        accent: 'sky',
      },
      {
        label: 'Packages',
        value: stats.packages || 0,
        meta: 'Health package bundles',
        to: '/admin/packages',
        Icon: Package,
        accent: 'mint',
      },
      {
        label: 'Diseases',
        value: stats.diseases || 0,
        meta: 'Concern landing pages',
        to: '/admin/diseases',
        Icon: Stethoscope,
        accent: 'navy',
      },
      {
        label: 'Users',
        value: stats.users || 0,
        meta: 'Customer & admin accounts',
        to: '/admin/users',
        Icon: Users,
        accent: 'teal',
      },
    ];
  }, [stats]);

  const quickActions = [
    { to: '/admin/tests', label: 'Manage tests', desc: 'Add, edit, or retire lab tests', Icon: FlaskConical },
    { to: '/admin/packages', label: 'Manage packages', desc: 'Update packages and pricing', Icon: Package },
    { to: '/admin/diseases', label: 'Manage diseases', desc: 'Health concern content', Icon: Stethoscope },
    { to: '/admin/users', label: 'Manage users', desc: 'Accounts and admin access', Icon: Users },
  ];

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner" aria-hidden="true" />
        <p>Loading catalog overview…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-error">
        <AlertCircle size={22} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dash">
      <header className="dash-hero">
        <div className="dash-hero-copy">
          <p className="dash-eyebrow">
            <Activity size={14} strokeWidth={2.5} />
            Catalog admin
          </p>
          <h1>
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="dash-hero-sub">
            Use this panel to manage tests, packages, diseases, and users. Customer bookings and
            inquiries are handled on WhatsApp Business — not in this admin panel.
          </p>
        </div>
        <div className="dash-hero-meta">
          <span className="dash-date">{todayLabel}</span>
          <a
            href={WHATSAPP_BUSINESS_URL}
            className="dash-hero-cta dash-hero-cta-wa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={16} variant="inverse" />
            Open WhatsApp Business
            <ExternalLink size={14} strokeWidth={2.5} />
          </a>
        </div>
      </header>

      <section className="dash-wa-banner" aria-label="WhatsApp Business notice">
        <div className="dash-wa-banner-icon" aria-hidden="true">
          <WhatsAppIcon size={28} />
        </div>
        <div className="dash-wa-banner-copy">
          <h2>Bookings &amp; inquiries live on WhatsApp Business</h2>
          <p>
            When customers tap Book Now on the website, they chat with your team on WhatsApp.
            Confirm slots, answer questions, and follow up there — this admin panel is only for
            catalog and account content.
          </p>
        </div>
        <a
          href={WHATSAPP_BUSINESS_URL}
          className="dash-wa-banner-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={16} variant="inverse" />
          Continue in WhatsApp
        </a>
      </section>

      <section className="dash-kpi-grid dash-kpi-grid-4" aria-label="Catalog metrics">
        {catalogCards.map(({ label, value, meta, to, Icon, accent }) => (
          <Link key={label} to={to} className={`dash-kpi accent-${accent}`}>
            <div className="dash-kpi-top">
              <span className="dash-kpi-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2.25} />
              </span>
              <ArrowUpRight size={15} strokeWidth={2.25} className="dash-kpi-arrow" />
            </div>
            <strong>{value}</strong>
            <span className="dash-kpi-label">{label}</span>
            <span className="dash-kpi-meta">{meta}</span>
          </Link>
        ))}
      </section>

      <section className="dash-actions" aria-label="Catalog actions">
        <div className="dash-section-head">
          <div>
            <h2>Manage website content</h2>
            <p>Everything customers see for tests, packages, and health concerns</p>
          </div>
        </div>
        <div className="dash-action-grid dash-action-grid-4">
          {quickActions.map(({ to, label, desc, Icon }) => (
            <Link key={to} to={to} className="dash-action-card">
              <span className="dash-action-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={2.25} />
              </span>
              <div>
                <strong>{label}</strong>
                <span>{desc}</span>
              </div>
              <ArrowUpRight size={16} strokeWidth={2.25} className="dash-action-arrow" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
