import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { packageAPI } from '../api/api';
import BookingSidebar from '../components/BookingSidebar';
import FAQAccordion from '../components/FAQAccordion';
import './Detail.css';

export default function PackageDetail() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    packageAPI
      .getBySlug(slug)
      .then((res) => setPkg(res.data.package))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        Loading package details...
      </div>
    );
  }

  if (!pkg) return <div className="empty-state">Package not found</div>;

  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  const testCount = pkg.totalTestsCount || pkg.tests?.length || 0;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <nav className="detail-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/packages">Packages</Link>
            <span>/</span>
            <span>{pkg.name}</span>
          </nav>

          <div className="detail-hero-badges">
            {pkg.isPopular && <span className="badge badge-accent">Popular</span>}
            {discount > 0 && <span className="badge badge-discount">{discount}% OFF</span>}
            <span className="badge badge-primary">{testCount} Tests Included</span>
            {pkg.fastingRequired ? (
              <span className="badge badge-warning">{pkg.fastingHours || 10} hrs Fasting</span>
            ) : (
              <span className="badge badge-success">No Fasting</span>
            )}
            <span className="badge badge-primary">Report in {pkg.reportTatHours}h</span>
          </div>

          <h1>{pkg.name}</h1>
          <p style={{ opacity: 0.92, fontSize: '1.05rem', maxWidth: '640px' }}>
            {pkg.description}
          </p>

          <div className="info-cards-row">
            <div className="info-card-mini">
              <strong>₹{pkg.price}</strong>
              <span>
                {pkg.originalPrice && (
                  <s style={{ opacity: 0.7 }}>₹{pkg.originalPrice}</s>
                )}{' '}
                Package Price
              </span>
            </div>
            <div className="info-card-mini">
              <strong>{pkg.gender || 'Everyone'}</strong>
              <span>Recommended For</span>
            </div>
            <div className="info-card-mini">
              <strong>{testCount} Tests</strong>
              <span>Included in Package</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        <div className="detail-content">
          {/* Overview */}
          <section className="detail-section">
            <h2>📦 Package Overview</h2>
            <p>{pkg.overview || pkg.description}</p>
            {pkg.highlights?.length > 0 && (
              <div className="highlights-row">
                {pkg.highlights.map((h) => (
                  <span key={h} className="highlight-pill">{h}</span>
                ))}
              </div>
            )}
          </section>

          {/* Benefits */}
          {pkg.benefits?.length > 0 && (
            <section className="detail-section">
              <h2>✨ Package Benefits</h2>
              <ul className="benefits-list">
                {pkg.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Tests by category */}
          {pkg.testCategories?.length > 0 ? (
            <section className="detail-section">
              <h2>🧪 Tests Included ({testCount})</h2>
              {pkg.testCategories.map((cat) => (
                <div key={cat.name} className="test-category-block">
                  <h4>{cat.name}</h4>
                  <ul className="test-category-list">
                    {cat.tests.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ) : (
            <section className="detail-section">
              <h2>🧪 Tests Included ({testCount})</h2>
              <table className="tests-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Individual Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.tests?.map((test) => (
                    <tr key={test._id}>
                      <td>{test.name}</td>
                      <td>₹{test.price}</td>
                      <td>
                        <Link to={`/tests/${test.slug}`}>Know More →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Full tests table with links */}
          {pkg.tests?.length > 0 && pkg.testCategories?.length > 0 && (
            <section className="detail-section">
              <h2>🔗 View Individual Test Details</h2>
              <table className="tests-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.tests.map((test) => (
                    <tr key={test._id}>
                      <td>{test.name}</td>
                      <td>₹{test.price}</td>
                      <td>
                        <Link to={`/tests/${test.slug}`}>View Details →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Preparation */}
          <section className="detail-section">
            <h2>📝 Preparation Instructions</h2>
            <p>{pkg.preparation || 'Please follow fasting instructions if applicable. Our phlebotomist will visit your home for comfortable sample collection.'}</p>
          </section>

          {/* FAQs */}
          {pkg.faqs?.length > 0 && (
            <section className="detail-section">
              <h2>💬 Frequently Asked Questions</h2>
              <FAQAccordion faqs={pkg.faqs} />
            </section>
          )}
        </div>

        <div className="detail-sidebar-sticky">
          <BookingSidebar item={pkg} itemType="package" />
        </div>
      </div>
    </>
  );
}
