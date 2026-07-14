import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function BookingSidebar({ item, itemType }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    addItem({
      itemType,
      itemId: item._id,
      name: item.name,
      price: item.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="booking-sidebar card">
      <div className="sidebar-price-block">
        <span className="sidebar-price">₹{item.price}</span>
        {item.originalPrice && (
          <>
            <span className="price-original">₹{item.originalPrice}</span>
            {discount > 0 && <span className="badge badge-discount">{discount}% OFF</span>}
          </>
        )}
      </div>

      <ul className="sidebar-info-list">
        <li>
          <span className="info-icon">👤</span>
          <div>
            <small>For</small>
            <strong>{item.gender || item.recommendedFor}</strong>
          </div>
        </li>
        <li>
          <span className="info-icon">🧪</span>
          <div>
            <small>Sample</small>
            <strong>{item.sampleType || `${item.tests?.length || 0} tests included`}</strong>
          </div>
        </li>
        <li>
          <span className="info-icon">🍽️</span>
          <div>
            <small>Fasting</small>
            <strong>
              {item.fastingRequired ? `${item.fastingHours || 10}-12 hrs required` : 'Not required'}
            </strong>
          </div>
        </li>
        <li>
          <span className="info-icon">⏱️</span>
          <div>
            <small>Reports within</small>
            <strong>{item.reportTatHours} Hours</strong>
          </div>
        </li>
      </ul>

      <div className="sidebar-trust">
        <span>✓ Free home collection</span>
        <span>✓ NABL accredited lab</span>
        <span>✓ Free report counselling</span>
      </div>

      <button type="button" className="btn btn-primary btn-lg sidebar-book-btn" onClick={handleAdd}>
        {added ? '✓ Added to Cart' : 'Book Now'}
      </button>
      <Link
        to={`/book/quick?type=${itemType}&id=${item._id}&name=${encodeURIComponent(item.name)}&price=${item.price}`}
        className="btn btn-outline sidebar-quick-btn"
      >
        Quick Book
      </Link>
    </div>
  );
}
