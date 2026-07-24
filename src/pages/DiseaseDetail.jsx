import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { diseaseAPI } from '../api/api';
import TestCard from '../components/TestCard';
import PackageCard from '../components/PackageCard';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, truncateMeta } from '../config/seo';
import { siteConfig } from '../config/siteConfig';
import '../components/cards.css';

export default function DiseaseDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    diseaseAPI
      .getBySlug(slug)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Seo title="Loading concern" path={`/disease/${slug}`} noindex />
        <div className="loading">Loading...</div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Seo title="Category not found" path={`/disease/${slug}`} noindex />
        <div className="empty-state">Category not found</div>
      </>
    );
  }

  const { disease, tests, packages } = data;
  const path = `/disease/${disease.slug}`;
  const description = truncateMeta(
    disease.description ||
      `Browse ${disease.name} related diagnostic tests and health packages from ${siteConfig.name}. Book home collection online.`
  );

  return (
    <>
      <Seo
        title={`${disease.name} Tests & Packages`}
        description={description}
        path={path}
        keywords={`${disease.name}, ${disease.name} tests, ${disease.name} checkup, ${siteConfig.name}`}
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: disease.name, path },
        ])}
        jsonLdId="disease-detail"
      />
      <div className="page-header">
        <div className="container">
          <span style={{ fontSize: '2rem' }}>{disease.icon}</span>
          <h1>{disease.name}</h1>
          <p>{disease.description}</p>
        </div>
      </div>

      <div className="container section">
        {tests.length > 0 && (
          <>
            <h2 className="section-title">Related Tests</h2>
            <div className="card-grid" style={{ marginBottom: '3rem' }}>
              {tests.map((test) => (
                <TestCard key={test._id} test={test} />
              ))}
            </div>
          </>
        )}

        {packages.length > 0 && (
          <>
            <h2 className="section-title">Related Packages</h2>
            <div className="card-grid">
              {packages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          </>
        )}

        {tests.length === 0 && packages.length === 0 && (
          <div className="empty-state">
            <p>No tests or packages found for this category yet.</p>
            <Link to="/tests" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse All Tests
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
