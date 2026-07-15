import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CATEGORY_VISUALS = {
  DIABETES: {
    image: '/images/bento-blood-tests.png',
    position: '62% 40%',
  },
  GENERAL: {
    image: '/images/hero-product-raw.png',
    position: '50% 40%',
  },
  KIDNEY: {
    image: '/images/bento-quick-book.png',
    position: '48% 42%',
  },
  HEART: {
    image: '/images/promo-doctor.png',
    position: '55% 28%',
  },
  LIVER: {
    image: '/images/bento-packages.png',
    position: '48% 42%',
  },
  THYROID: {
    image: '/images/bento-concerns.png',
    position: '58% 38%',
  },
};

const DEFAULT_VISUAL = {
  image: '/images/hero-visual.png',
  position: '50% 40%',
};

function getCardDetails(name, test) {
  const normName = name?.toLowerCase() || '';
  if (normName.includes('glucose') || normName.includes('sugar') || (normName.includes('fasting') && normName.includes('blood'))) {
    return {
      category: 'DIABETES',
      displayName: 'Blood Glucose Fasting',
      originalPrice: 199,
      reportTat: '6 hrs report',
    };
  }
  if (normName.includes('hba1c')) {
    return {
      category: 'DIABETES',
      displayName: 'HbA1c',
      originalPrice: 699,
      reportTat: '12 hrs report',
    };
  }
  if (normName.includes('complete hemogram') || normName.includes('cbc') || normName.includes('blood count') || normName.includes('hemogram')) {
    return {
      category: 'GENERAL',
      displayName: 'Complete Blood Count',
      originalPrice: 499,
      reportTat: '8 hrs report',
    };
  }
  if (normName.includes('kidney') || normName.includes('kft')) {
    return {
      category: 'KIDNEY',
      displayName: 'Kidney Function Test',
      originalPrice: 799,
      reportTat: '10 hrs report',
    };
  }
  if (normName.includes('lipid') || normName.includes('heart') || normName.includes('cholesterol') || normName.includes('coronary')) {
    return {
      category: 'HEART',
      displayName: 'Lipid Profile',
      originalPrice: 899,
      reportTat: '10 hrs report',
    };
  }
  if (normName.includes('liver') || normName.includes('lft')) {
    return {
      category: 'LIVER',
      displayName: 'Liver Function Test',
      originalPrice: 799,
      reportTat: '10 hrs report',
    };
  }
  if (normName.includes('thyroid')) {
    return {
      category: 'THYROID',
      displayName: 'Thyroid Profile (T3,T4,TSH)',
      originalPrice: 999,
      reportTat: '12 hrs report',
    };
  }
  if (normName.includes('urine')) {
    return {
      category: 'GENERAL',
      displayName: 'Urine Routine',
      originalPrice: 299,
      reportTat: '6 hrs report',
    };
  }

  let category = 'GENERAL';
  if (test.diseaseCategories?.length > 0) {
    category = String(test.diseaseCategories[0]).toUpperCase();
  }
  return {
    category,
    displayName: test.name,
    originalPrice: test.originalPrice || Math.round(test.price * 1.8),
    reportTat: `${test.reportTatHours || 12} hrs report`,
  };
}

export default function TestCard({ test, variant = 'default', active = false, onActivate }) {
  const { addItem } = useCart();

  const handleBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      itemType: 'test',
      itemId: test._id,
      name: test.name,
      price: test.price,
    });
  };

  const { category, displayName, originalPrice, reportTat } = getCardDetails(test.name, test);
  const visual = CATEGORY_VISUALS[category] || DEFAULT_VISUAL;

  if (variant === 'carousel') {
    const rootClass = `assay-lens assay-lens--carousel${active ? ' is-active' : ' is-side'}`;

    if (!active) {
      return (
        <button
          type="button"
          className={rootClass}
          onClick={() => onActivate?.(test._id)}
          aria-label={`Focus ${displayName}`}
        >
          <div className="assay-lens-media">
            <img
              src={visual.image}
              alt=""
              className="assay-lens-img"
              style={{ objectPosition: visual.position }}
              loading="lazy"
              decoding="async"
            />
            <div className="assay-lens-side-overlay">
              <span className="assay-lens-cat">{category}</span>
              <h3 className="assay-lens-title">{displayName}</h3>
            </div>
          </div>
        </button>
      );
    }

    return (
      <article className={rootClass}>
        <Link to={`/tests/${test.slug}`} className="assay-lens-media">
          <img
            src={visual.image}
            alt=""
            className="assay-lens-img"
            style={{ objectPosition: visual.position }}
            loading="lazy"
            decoding="async"
          />
        </Link>

        <div className="assay-lens-focus-body">
          <h3 className="assay-lens-title">
            <Link to={`/tests/${test.slug}`}>{displayName}</Link>
          </h3>
          <p className="assay-lens-focus-desc">
            {category} test with {reportTat.toLowerCase()}. Trusted home collection,
            transparent pricing from ₹{test.price}.
          </p>
        </div>

        <div className="assay-lens-focus-foot">
          <div className="assay-lens-focus-meta">
            <span>
              <Clock size={14} strokeWidth={2.25} aria-hidden="true" />
              {reportTat.replace(' report', '')}
            </span>
            <span className="assay-lens-focus-price">
              ₹{test.price}
              {originalPrice ? <em>₹{originalPrice}</em> : null}
            </span>
          </div>
          <button
            type="button"
            className="assay-lens-discover"
            onClick={handleBook}
            aria-label={`Book ${displayName}`}
          >
            Book now
          </button>
        </div>
      </article>
    );
  }

  return (
    <Link to={`/tests/${test.slug}`} className="assay-lens">
      <div className="assay-lens-media">
        <img
          src={visual.image}
          alt=""
          className="assay-lens-img"
          style={{ objectPosition: visual.position }}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="assay-lens-body">
        <span className="assay-lens-cat">{category}</span>
        <h3 className="assay-lens-title">{displayName}</h3>
        <div className="assay-lens-tat">
          <Clock size={13} strokeWidth={2.5} />
          <span>{reportTat}</span>
        </div>

        <div className="assay-lens-foot">
          <div className="assay-lens-pricing">
            <span className="assay-lens-price">₹{test.price}</span>
            {originalPrice ? (
              <span className="assay-lens-strike">₹{originalPrice}</span>
            ) : null}
          </div>
          <button
            type="button"
            className="assay-lens-book"
            onClick={handleBook}
            aria-label={`Add ${displayName} to cart`}
          >
            <ArrowUpRight size={16} strokeWidth={2.75} />
          </button>
        </div>
      </div>
    </Link>
  );
}
