import { Zap } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { getWhatsAppUrl, getBookingWhatsAppMessage } from '../utils/whatsapp';

export default function BookingSidebar({ item, itemType }) {
  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const whatsappUrl = getWhatsAppUrl(getBookingWhatsAppMessage(item, itemType));

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
            <small>{itemType === 'package' ? 'Includes' : 'Sample'}</small>
            <strong>
              {itemType === 'package'
                ? `${item.totalTestsCount || item.tests?.length || 0} tests included`
                : item.sampleType || 'Blood'}
            </strong>
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

      <a
        href={whatsappUrl}
        className="btn btn-primary btn-lg sidebar-book-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Zap size={18} strokeWidth={2.4} fill="currentColor" />
        Book Now
      </a>
      <a
        href={whatsappUrl}
        className="btn btn-outline sidebar-quick-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon size={18} />
        WhatsApp Us
      </a>
    </div>
  );
}
