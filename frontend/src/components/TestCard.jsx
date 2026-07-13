import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function TestCard({ test }) {
  const { addItem } = useCart();

  const handleBook = (e) => {
    e.preventDefault();
    addItem({
      itemType: 'test',
      itemId: test._id,
      name: test.name,
      price: test.price,
    });
  };

  return (
    <div className="card test-card">
      <div className="card-top">
        <div className="card-badges">
          {test.isPopular && <span className="badge badge-accent">Popular</span>}
          {test.fastingRequired && <span className="badge badge-warning">Fasting</span>}
        </div>
        <span className="card-icon">🩸</span>
      </div>
      <h3>{test.name}</h3>
      <p className="card-desc">{test.description?.slice(0, 75)}...</p>
      <div className="card-meta">
        <span className="meta-chip">{test.sampleType}</span>
        <span className="meta-chip">⏱ {test.reportTatHours}h report</span>
        {test.parameters?.length > 0 && (
          <span className="meta-chip">{test.parameters.length} parameters</span>
        )}
      </div>
      <div className="card-footer">
        <span className="price">₹{test.price}</span>
        <div className="card-actions">
          <Link to={`/tests/${test.slug}`} className="btn btn-ghost btn-sm">
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
