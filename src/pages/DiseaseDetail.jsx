import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { diseaseAPI } from '../api/api';
import TestCard from '../components/TestCard';
import PackageCard from '../components/PackageCard';
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

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="empty-state">Category not found</div>;

  const { disease, tests, packages } = data;

  return (
    <>
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
