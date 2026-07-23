import { Link } from 'react-router-dom';
import {
  FlaskConical,
  ClipboardList,
  Heart,
  Users,
  User,
  Activity,
  Ribbon,
} from 'lucide-react';

const PACKAGE_THUMBNAILS = {
  'energex-basic-health-checkup': {
    src: '/images/pkg-basic-health.png?v=3',
    position: '50% 45%',
  },
  'energex-advance-full-body-checkup': {
    src: '/images/pkg-advance-fullbody.png?v=3',
    position: '50% 40%',
  },
  'energex-heart-care-plan': {
    src: '/images/pkg-heart-care.png?v=4',
    position: '50% 35%',
  },
  'energex-senior-citizen-plan': {
    src: '/images/pkg-senior-citizen.png?v=3',
    position: '45% 30%',
  },
  'energex-female-care-plan': {
    src: '/images/pkg-female-care.png?v=3',
    position: '50% 28%',
  },
  'energex-male-care-plan': {
    src: '/images/pkg-male-care.png?v=3',
    position: '50% 30%',
  },
  'energex-cancer-screening-male': {
    src: '/images/pkg-cancer-male.png?v=3',
    position: '50% 40%',
  },
  'energex-cancer-screening-female': {
    src: '/images/pkg-cancer-female.png?v=3',
    position: '48% 35%',
  },
};

const PACKAGE_ICONS = {
  'energex-basic-health-checkup': FlaskConical,
  'energex-advance-full-body-checkup': ClipboardList,
  'energex-heart-care-plan': Heart,
  'energex-senior-citizen-plan': Users,
  'energex-female-care-plan': User,
  'energex-male-care-plan': Activity,
  'energex-cancer-screening-male': Ribbon,
  'energex-cancer-screening-female': Ribbon,
};

/** Distinctive phrase to emphasize inside the package name */
const PACKAGE_TITLE_HIGHLIGHTS = {
  'energex-basic-health-checkup': 'Basic Health',
  'energex-advance-full-body-checkup': 'Advance Full Body',
  'energex-heart-care-plan': 'Heart Care',
  'energex-senior-citizen-plan': 'Senior Citizen',
  'energex-female-care-plan': 'Female Care',
  'energex-male-care-plan': 'Male Care',
  'energex-cancer-screening-male': 'Cancer Screening',
  'energex-cancer-screening-female': 'Cancer Screening',
};

export function getPackageImage(pkg = {}) {
  const bySlug = PACKAGE_THUMBNAILS[pkg.slug];
  if (bySlug) return bySlug;

  const n = (pkg.name || '').toLowerCase();
  if (n.includes('cancer') && n.includes('female')) return PACKAGE_THUMBNAILS['energex-cancer-screening-female'];
  if (n.includes('cancer') && n.includes('male')) return PACKAGE_THUMBNAILS['energex-cancer-screening-male'];
  if (n.includes('female')) return PACKAGE_THUMBNAILS['energex-female-care-plan'];
  if (n.includes('male')) return PACKAGE_THUMBNAILS['energex-male-care-plan'];
  if (n.includes('heart')) return PACKAGE_THUMBNAILS['energex-heart-care-plan'];
  if (n.includes('senior')) return PACKAGE_THUMBNAILS['energex-senior-citizen-plan'];
  if (n.includes('advance') || n.includes('full body')) return PACKAGE_THUMBNAILS['energex-advance-full-body-checkup'];
  if (n.includes('basic')) return PACKAGE_THUMBNAILS['energex-basic-health-checkup'];

  return { src: '/images/bento-packages.png', position: '48% 42%' };
}

export function formatPackageTitle(name = '', slug = '') {
  const highlight = PACKAGE_TITLE_HIGHLIGHTS[slug];
  if (!highlight || !name) return name;

  const idx = name.indexOf(highlight);
  if (idx === -1) return name;

  return (
    <>
      {name.slice(0, idx)}
      <em className="pkg-title-accent">{highlight}</em>
      {name.slice(idx + highlight.length)}
    </>
  );
}

export default function PackageCard({ pkg }) {
  const testCount = pkg.totalTestsCount || pkg.tests?.length || 0;
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;
  const visual = getPackageImage(pkg);
  const Icon = PACKAGE_ICONS[pkg.slug] || FlaskConical;
  const detailPath = `/packages/${pkg.slug}`;
  const blurb =
    pkg.description?.length > 110
      ? `${pkg.description.slice(0, 107).trim()}…`
      : pkg.description || `${testCount} tests included`;

  return (
    <article className="clinic-card">
      <div className="clinic-card-media">
        <img
          src={visual.src}
          alt=""
          className="clinic-card-img"
          style={{ objectPosition: visual.position }}
          loading="lazy"
          decoding="async"
        />
        {discount > 0 ? <span className="clinic-card-badge">{discount}% OFF</span> : null}
      </div>

      <div className="clinic-card-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={1.75} />
      </div>

      <div className="clinic-card-body">
        <h3 className="clinic-card-title">
          <Link to={detailPath}>{formatPackageTitle(pkg.name, pkg.slug)}</Link>
        </h3>
        <p className="clinic-card-desc">{blurb}</p>
        <div className="clinic-card-meta">
          <span className="clinic-card-price">₹{pkg.price}</span>
          {pkg.originalPrice ? (
            <span className="clinic-card-strike">₹{pkg.originalPrice}</span>
          ) : null}
          <span className="clinic-card-tests">{testCount} tests</span>
        </div>
        <Link to={detailPath} className="clinic-card-cta">
          Learn More
        </Link>
      </div>
    </article>
  );
}
