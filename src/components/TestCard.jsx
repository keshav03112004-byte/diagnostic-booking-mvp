import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Droplet } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function TestCard({ test }) {
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

  const getCardDetails = (name, test) => {
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
        accent: true,
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
  };

  const { category, displayName, originalPrice, reportTat, accent } = getCardDetails(test.name, test);

  return (
    <Link to={`/tests/${test.slug}`} className="screenshot-test-card">
      <div className="test-card-top">
        <span className="category-badge">{category}</span>
        <span className="blood-drop-circle" aria-hidden="true">
          <Droplet size={14} strokeWidth={2.25} />
        </span>
      </div>

      <div className="test-card-body">
        <h3 className="test-card-title">{displayName}</h3>
        <div className="report-tat-row">
          <Clock size={13} strokeWidth={2.5} />
          <span>{reportTat}</span>
        </div>
      </div>

      <div className="test-card-bottom">
        <div className="price-container">
          <span className="price-tag">₹{test.price}</span>
          {originalPrice ? <span className="strike-price">₹{originalPrice}</span> : null}
        </div>
        <button
          type="button"
          className={`action-circle-btn${accent ? ' is-accent' : ''}`}
          onClick={handleBook}
          aria-label={`Add ${displayName} to cart`}
        >
          <ArrowUpRight size={16} strokeWidth={2.75} />
        </button>
      </div>
    </Link>
  );
}
