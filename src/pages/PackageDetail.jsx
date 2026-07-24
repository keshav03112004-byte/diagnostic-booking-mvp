import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package as PackageIcon,
  CheckCircle2,
  Clock,
  FlaskConical,
  Utensils,
  Users,
  FileText,
  ArrowRight,
  BadgePercent,
  Sparkles,
} from 'lucide-react';
import { packageAPI } from '../api/api';
import BookingSidebar from '../components/BookingSidebar';
import FAQAccordion from '../components/FAQAccordion';
import PackageCard, { getPackageImage } from '../components/PackageCard';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, productJsonLd, truncateMeta } from '../config/seo';
import { siteConfig } from '../config/siteConfig';
import './Detail.css';
import '../components/cards.css';

export default function PackageDetail() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setPkg(null);

    packageAPI
      .getBySlug(slug)
      .then((res) => {
        if (!cancelled) setPkg(res.data.package);
      })
      .catch(() => {
        if (!cancelled) {
          setPkg(null);
          setError('Package not found or could not be loaded.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!pkg) return undefined;
    let cancelled = false;

    packageAPI
      .getAll({ sort: 'popular' })
      .then((res) => {
        if (cancelled) return;
        const others = (res.data.packages || [])
          .filter((p) => p._id !== pkg._id && p.slug !== pkg.slug)
          .slice(0, 3);
        setRelated(others);
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [pkg]);

  if (loading) {
    return (
      <>
        <Seo title="Loading package" path={`/packages/${slug}`} noindex />
        <div className="loading">
          <div className="loading-spinner" />
          Loading package details...
        </div>
      </>
    );
  }

  if (!pkg) {
    return (
      <>
        <Seo title="Package not found" path={`/packages/${slug}`} noindex />
        <div className="container section">
          <div className="empty-state package-detail-empty">
            <h2>Package not found</h2>
            <p>{error || 'This health package may have been removed or the link is incorrect.'}</p>
            <Link to="/packages" className="btn btn-primary">
              Browse all packages
            </Link>
          </div>
        </div>
      </>
    );
  }

  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;
  const savings =
    pkg.originalPrice && pkg.originalPrice > pkg.price
      ? pkg.originalPrice - pkg.price
      : 0;
  const testCount = pkg.totalTestsCount || pkg.tests?.length || pkg.includedTestNames?.length || 0;
  const hasCategories = pkg.testCategories?.length > 0;
  const hasLinkedTests = pkg.tests?.length > 0;
  const path = `/packages/${pkg.slug}`;
  const description = truncateMeta(
    pkg.description ||
      `Book ${pkg.name} with ${siteConfig.name}. ${testCount} tests included. Home collection and smart reports from ₹${pkg.price}.`
  );
  const ogImage = getPackageImage(pkg).src;

  return (
    <>
      <Seo
        title={`${pkg.name} — Health Package`}
        description={description}
        path={path}
        image={ogImage}
        type="product"
        keywords={`${pkg.name}, health checkup package, full body checkup, ${siteConfig.name}`}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Packages', path: '/packages' },
            { name: pkg.name, path },
          ]),
          productJsonLd({
            name: pkg.name,
            description,
            price: pkg.price,
            path,
            image: ogImage,
            sku: pkg.slug,
          }),
        ]}
        jsonLdId="package-detail"
      />
      <div className="page-header package-detail-header">
        <div className="container">
          <nav className="detail-breadcrumb" aria-label="Breadcrumb">
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
          <p className="package-detail-lead">{pkg.description}</p>

          <div className="info-cards-row">
            <div className="info-card-mini">
              <strong>₹{pkg.price}</strong>
              <span>
                {pkg.originalPrice ? (
                  <>
                    <s>₹{pkg.originalPrice}</s> Package price
                  </>
                ) : (
                  'Package price'
                )}
              </span>
            </div>
            <div className="info-card-mini">
              <strong>{pkg.gender || pkg.recommendedFor || 'Everyone'}</strong>
              <span>Recommended for</span>
            </div>
            <div className="info-card-mini">
              <strong>{testCount} Tests</strong>
              <span>Included in package</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        <div className="detail-content">
          <section className="detail-section">
            <h2>
              <PackageIcon size={20} strokeWidth={2.25} aria-hidden="true" />
              Package overview
            </h2>
            <p>{pkg.overview || pkg.description}</p>
            {pkg.highlights?.length > 0 && (
              <div className="highlights-row">
                {pkg.highlights.map((h) => (
                  <span key={h} className="highlight-pill">{h}</span>
                ))}
              </div>
            )}
            {savings > 0 && (
              <div className="package-savings-note">
                <BadgePercent size={18} strokeWidth={2.25} aria-hidden="true" />
                <span>
                  You save <strong>₹{savings}</strong> ({discount}% off) versus booking these tests individually.
                </span>
              </div>
            )}
          </section>

          {pkg.benefits?.length > 0 && (
            <section className="detail-section">
              <h2>
                <Sparkles size={20} strokeWidth={2.25} aria-hidden="true" />
                Package benefits
              </h2>
              <ul className="benefits-list">
                {pkg.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="detail-section">
            <h2>
              <FlaskConical size={20} strokeWidth={2.25} aria-hidden="true" />
              Tests included ({testCount})
            </h2>

            {hasCategories ? (
              <div className="package-test-categories">
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
              </div>
            ) : null}

            {hasLinkedTests ? (
              <div className={hasCategories ? 'package-tests-table-wrap has-categories' : 'package-tests-table-wrap'}>
                {hasCategories ? <h3 className="package-tests-table-title">View individual test details</h3> : null}
                <table className="tests-table">
                  <thead>
                    <tr>
                      <th>Test name</th>
                      <th>Sample</th>
                      <th>Price</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {pkg.tests.map((test) => (
                      <tr key={test._id}>
                        <td>
                          <Link to={`/tests/${test.slug}`} className="tests-table-name">
                            {test.name}
                          </Link>
                        </td>
                        <td>{test.sampleType || '—'}</td>
                        <td>₹{test.price}</td>
                        <td>
                          <Link to={`/tests/${test.slug}`} className="tests-table-link">
                            Details
                            <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !hasCategories && pkg.includedTestNames?.length > 0 ? (
              <ul className="test-category-list">
                {pkg.includedTestNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            ) : !hasCategories ? (
              <p>Test details will appear here once this package is fully configured.</p>
            ) : null}
          </section>

          <section className="detail-section package-meta-grid-section">
            <h2>
              <FileText size={20} strokeWidth={2.25} aria-hidden="true" />
              What to know before booking
            </h2>
            <div className="package-meta-grid">
              <article className="package-meta-card">
                <Utensils size={18} strokeWidth={2.25} aria-hidden="true" />
                <div>
                  <strong>Fasting</strong>
                  <p>
                    {pkg.fastingRequired
                      ? `${pkg.fastingHours || 10}–12 hours required before collection.`
                      : 'No fasting required for this package.'}
                  </p>
                </div>
              </article>
              <article className="package-meta-card">
                <Clock size={18} strokeWidth={2.25} aria-hidden="true" />
                <div>
                  <strong>Report turnaround</strong>
                  <p>Digital reports typically within {pkg.reportTatHours} hours.</p>
                </div>
              </article>
              <article className="package-meta-card">
                <Users size={18} strokeWidth={2.25} aria-hidden="true" />
                <div>
                  <strong>Best for</strong>
                  <p>{pkg.recommendedFor || pkg.gender || 'Everyone seeking preventive screening.'}</p>
                </div>
              </article>
              <article className="package-meta-card">
                <CheckCircle2 size={18} strokeWidth={2.25} aria-hidden="true" />
                <div>
                  <strong>Home collection</strong>
                  <p>Certified phlebotomist visit included with every booking.</p>
                </div>
              </article>
            </div>
          </section>

          <section className="detail-section">
            <h2>
              <FileText size={20} strokeWidth={2.25} aria-hidden="true" />
              Preparation instructions
            </h2>
            <p>
              {pkg.preparation ||
                'Please follow fasting instructions if applicable. Our phlebotomist will visit your home for comfortable sample collection.'}
            </p>
          </section>

          {pkg.faqs?.length > 0 && (
            <section className="detail-section">
              <h2>
                <CheckCircle2 size={20} strokeWidth={2.25} aria-hidden="true" />
                Frequently asked questions
              </h2>
              <FAQAccordion faqs={pkg.faqs} />
            </section>
          )}
        </div>

        <div className="detail-sidebar-sticky">
          <BookingSidebar item={pkg} itemType="package" />
        </div>
      </div>

      {related.length > 0 && (
        <section className="container section package-related-section">
          <div className="section-header package-related-header">
            <h2 className="section-title">Related health packages</h2>
            <p className="section-subtitle">Explore more checkup packages curated for common health needs.</p>
          </div>
          <div className="card-grid">
            {related.map((item) => (
              <PackageCard key={item._id} pkg={item} />
            ))}
          </div>
          <div className="package-related-cta">
            <Link to="/packages" className="btn btn-outline">
              View all packages
              <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
