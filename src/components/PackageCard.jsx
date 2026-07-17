import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

function getPackageImage(name = '') {
  const n = name.toLowerCase();

  if (n.includes('diabetes') || n.includes('sugar') || n.includes('glucose')) {
    return { src: '/images/hero-product-raw.png', position: '50% 40%' };
  }
  if (n.includes('thyroid') || n.includes('vitamin')) {
    return { src: '/images/bento-concerns.png', position: '58% 38%' };
  }
  if (n.includes('women') || n.includes('female') || n.includes('pregnancy')) {
    return { src: '/images/value-home-portrait.png', position: '50% 28%' };
  }
  if (n.includes('heart') || n.includes('cardiac') || n.includes('lipid')) {
    return { src: '/images/promo-doctor.png', position: '55% 28%' };
  }
  if (n.includes('kidney') || n.includes('liver')) {
    return { src: '/images/value-home-collection.png', position: '40% 45%' };
  }
  if (n.includes('basic') || n.includes('health checkup') || n.includes('checkup') || n.includes('full body')) {
    return { src: '/images/bento-packages.png', position: '48% 42%' };
  }
  if (n.includes('quick') || n.includes('fever') || n.includes('infection')) {
    return { src: '/images/bento-quick-book.png', position: '50% 40%' };
  }

  return { src: '/images/promo-banner-ref.png', position: '50% 40%' };
}

export default function PackageCard({ pkg, variant = 'default' }) {
  const testCount = pkg.tests?.length || 0;
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;
  const isFeatured = variant === 'featured';
  const visual = getPackageImage(pkg.name);
  const detailPath = `/packages/${pkg.slug}`;

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
          <Link
            to={detailPath}
            className="action-button"
            aria-label={`View ${pkg.name} details`}
          >
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}
