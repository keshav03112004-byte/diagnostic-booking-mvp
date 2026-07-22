import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const PACKAGE_THUMBNAILS = {
  'energex-basic-health-checkup': {
    src: '/images/pkg-basic-health.png',
    position: '50% 45%',
  },
  'energex-advance-full-body-checkup': {
    src: '/images/pkg-advance-fullbody.png',
    position: '50% 40%',
  },
  'energex-heart-care-plan': {
    src: '/images/pkg-heart-care.png',
    position: '50% 40%',
  },
  'energex-senior-citizen-plan': {
    src: '/images/pkg-senior-citizen.png',
    position: '45% 35%',
  },
  'energex-female-care-plan': {
    src: '/images/pkg-female-care.png',
    position: '50% 30%',
  },
  'energex-male-care-plan': {
    src: '/images/pkg-male-care.png',
    position: '50% 30%',
  },
  'energex-cancer-screening-male': {
    src: '/images/pkg-cancer-male.png',
    position: '50% 40%',
  },
  'energex-cancer-screening-female': {
    src: '/images/pkg-cancer-female.png',
    position: '50% 35%',
  },
};

function getPackageImage(pkg = {}) {
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

export default function PackageCard({ pkg, variant = 'default' }) {
  const navigate = useNavigate();
  const testCount = pkg.totalTestsCount || pkg.tests?.length || 0;
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;
  const isFeatured = variant === 'featured';
  const visual = getPackageImage(pkg);
  const detailPath = `/packages/${pkg.slug}`;

  const goToDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pkg.slug) navigate(detailPath);
  };

  return (
    <article className={isFeatured ? 'premium-package-card' : 'premium-package-card is-light'}>
      <Link to={detailPath} className="card-media-link" aria-label={`View ${pkg.name} details`}>
        <div className="card-media">
          <img
            src={visual.src}
            alt=""
            className="card-media-img"
            style={{ objectPosition: visual.position }}
            loading="lazy"
            decoding="async"
          />
          {discount > 0 ? (
            <span className="badge-discount">{discount}% OFF</span>
          ) : null}
        </div>
      </Link>

      <div className="card-content">
        <div className="card-body-text">
          <h3 className="card-title">
            <Link to={detailPath}>{pkg.name}</Link>
          </h3>
          <p className="card-test-count">{testCount} tests included</p>
        </div>

        <div className="card-footer">
          <div className="price-info">
            <span className="price">₹{pkg.price}</span>
            {pkg.originalPrice ? (
              <span className="price-original">₹{pkg.originalPrice}</span>
            ) : null}
          </div>
          <button
            type="button"
            className="action-button"
            onClick={goToDetails}
            aria-label={`View ${pkg.name} details`}
          >
            <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
