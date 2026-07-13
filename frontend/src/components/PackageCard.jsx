import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function PackageCard({ pkg }) {
  const { addItem } = useCart();
  const testCount = pkg.tests?.length || 0;
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  const handleBook = (e) => {
    e.preventDefault();
    addItem({
      itemType: 'package',
      itemId: pkg._id,
      name: pkg.name,
      price: pkg.price,
    });
  };

  return (
    <div className="card package-card">
      <div className="card-top">
        <div className="card-badges">
          {discount > 0 && <span className="badge badge-discount">{discount}% OFF</span>}
          {pkg.isPopular && <span className="badge badge-primary">Popular</span>}
        </div>
        <span className="card-icon">📦</span>
      </div>
      <h3>{pkg.name}</h3>
      <p className="card-desc">{pkg.description?.slice(0, 80)}...</p>
      <div className="card-meta">
        <span className="meta-chip">{testCount} tests included</span>
        <span className="meta-chip">⏱ {pkg.reportTatHours}h report</span>
        {pkg.gender && <span className="meta-chip">👤 {pkg.gender}</span>}
      </div>
      <div className="card-footer">
        <div>
          <span className="price">₹{pkg.price}</span>
          {pkg.originalPrice && (
            <span className="price-original">₹{pkg.originalPrice}</span>
          )}
        </div>
        <div className="card-actions">
          <Link to={`/packages/${pkg.slug}`} className="btn btn-ghost btn-sm">
            Details
          </Link>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleBook}>
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
