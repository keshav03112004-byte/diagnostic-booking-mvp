import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { testAPI } from '../api/api';
import BookingSidebar from '../components/BookingSidebar';
import FAQAccordion from '../components/FAQAccordion';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, productJsonLd, truncateMeta } from '../config/seo';
import { siteConfig } from '../config/siteConfig';
import './Detail.css';

export default function TestDetail() {
  const { slug } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testAPI
      .getBySlug(slug)
      .then((res) => setTest(res.data.test))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Seo title="Loading test" path={`/tests/${slug}`} noindex />
        <div className="loading">
          <div className="loading-spinner" />
          Loading test details...
        </div>
      </>
    );
  }

  if (!test) {
    return (
      <>
        <Seo title="Test not found" path={`/tests/${slug}`} noindex />
        <div className="empty-state">Test not found</div>
      </>
    );
  }

  const discount = test.originalPrice
    ? Math.round(((test.originalPrice - test.price) / test.originalPrice) * 100)
    : 0;
  const path = `/tests/${test.slug}`;
  const description = truncateMeta(
    test.description ||
      `Book ${test.name} online with ${siteConfig.name}. Home collection available. Report in ${test.reportTatHours || 24} hours. Transparent pricing from ₹${test.price}.`
  );

  return (
    <>
      <Seo
        title={`${test.name} — Book Online`}
        description={description}
        path={path}
        type="product"
        keywords={`${test.name}, book ${test.name}, lab test at home, ${siteConfig.name}`}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Tests', path: '/tests' },
            { name: test.name, path },
          ]),
          productJsonLd({
            name: test.name,
            description,
            price: test.price,
            path,
            sku: test.slug,
          }),
        ]}
        jsonLdId="test-detail"
      />
      <div className="page-header">
        <div className="container">
          <nav className="detail-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/tests">Tests</Link>
            <span>/</span>
            <span>{test.name}</span>
          </nav>

          <div className="detail-hero-badges">
            {test.isPopular && <span className="badge badge-accent">Popular</span>}
            {discount > 0 && <span className="badge badge-discount">{discount}% OFF</span>}
            {test.fastingRequired ? (
              <span className="badge badge-warning">{test.fastingHours || 10} hrs Fasting</span>
            ) : (
              <span className="badge badge-success">No Fasting</span>
            )}
            <span className="badge badge-primary">Report in {test.reportTatHours}h</span>
          </div>

          <h1>{test.name}</h1>

          <div className="info-cards-row">
            <div className="info-card-mini">
              <strong>{test.sampleType}</strong>
              <span>Sample Type</span>
            </div>
            <div className="info-card-mini">
              <strong>{test.gender || 'Everyone'}</strong>
              <span>Recommended For</span>
            </div>
            <div className="info-card-mini">
              <strong>{test.parameters?.length || '—'} Parameters</strong>
              <span>Tests Included</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        <div className="detail-content">
          {/* Overview */}
          <section className="detail-section">
            <h2>About This Test</h2>
            <p>{test.overview || test.description}</p>
          </section>

          {/* Parameters */}
          {test.parameters?.length > 0 && (
            <section className="detail-section">
              <h2>Parameters Included ({test.parameters.length})</h2>
              <div className="parameters-grid">
                {test.parameters.map((param) => (
                  <div key={param} className="parameter-item">{param}</div>
                ))}
              </div>
            </section>
          )}

          {/* Why take this test */}
          {test.whyTakeTest && (
            <section className="detail-section">
              <h2>❓ Why Should I Get Tested?</h2>
              <p>{test.whyTakeTest}</p>
              {test.whenToTake && (
                <>
                  <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1rem' }}>When to take this test</h3>
                  <p>{test.whenToTake}</p>
                </>
              )}
            </section>
          )}

          {/* Symptoms */}
          {test.symptoms?.length > 0 && (
            <section className="detail-section">
              <h2>⚠️ Related Symptoms</h2>
              <p style={{ marginBottom: '1rem' }}>Consider this test if you experience any of the following:</p>
              <div className="symptoms-grid">
                {test.symptoms.map((symptom) => (
                  <span key={symptom} className="symptom-chip">{symptom}</span>
                ))}
              </div>
            </section>
          )}

          {/* Preparation */}
          <section className="detail-section">
            <h2>📝 Test Preparation</h2>
            <p>{test.preparation || 'No special preparation required. Our phlebotomist will guide you during home collection.'}</p>
          </section>

          {/* FAQs */}
          {test.faqs?.length > 0 && (
            <section className="detail-section">
              <h2>💬 Frequently Asked Questions</h2>
              <FAQAccordion faqs={test.faqs} />
            </section>
          )}
        </div>

        <div className="detail-sidebar-sticky">
          <BookingSidebar item={test} itemType="test" />
        </div>
      </div>
    </>
  );
}
