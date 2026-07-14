import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowUpRight, Box } from 'lucide-react';

export default function PackageCard({ pkg, variant = 'default' }) {
  const { addItem } = useCart();
  const testCount = pkg.tests?.length || 0;
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;
  const isFeatured = variant === 'featured';

  const handleBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      itemType: 'package',
      itemId: pkg._id,
      name: pkg.name,
      price: pkg.price,
    });
  };

  return (
    <article className={isFeatured ? 'premium-package-card' : 'package-card premium-package-card is-light'}>
      <div className="card-top-row">
        {discount > 0 ? (
          <span className="badge-discount">{discount}% OFF</span>
        ) : (
          <span />
        )}
        <Box className="card-icon" size={22} strokeWidth={1.75} />
      </div>

      <div className="card-body-text">
        <h3 className="card-title">
          <Link to={`/packages/${pkg.slug}`}>{pkg.name}</Link>
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
          onClick={handleBook}
          aria-label={`Add ${pkg.name} to cart`}
        >
          <ArrowUpRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}
