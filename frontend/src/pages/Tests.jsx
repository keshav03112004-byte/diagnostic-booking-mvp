import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { testAPI, diseaseAPI } from '../api/api';
import TestCard from '../components/TestCard';
import '../components/cards.css';

export default function Tests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tests, setTests] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const disease = searchParams.get('disease') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    diseaseAPI.getAll().then((res) => setDiseases(res.data.diseases));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    testAPI
      .getAll({ search: search || undefined, disease: disease || undefined, sort: sort || undefined })
      .then((res) => setTests(res.data.tests))
      .catch(() => setError('Could not load tests. Make sure the backend is running on port 5000 and MongoDB is seeded (npm run seed).'))
      .finally(() => setLoading(false));
  }, [search, disease, sort]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>All Diagnostic Tests</h1>
          <p>Browse and book individual lab tests with home collection</p>
        </div>
      </div>

      <div className="container section">
        <div className="filters">
          <input
            type="search"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-search"
          />
          <select value={disease} onChange={(e) => updateFilter('disease', e.target.value)}>
            <option value="">All Categories</option>
            {diseases.map((d) => (
              <option key={d._id} value={d.slug}>{d.name}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
            <option value="">Sort by</option>
            <option value="popular">Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading tests...</div>
        ) : tests.length === 0 ? (
          <div className="empty-state">No tests found. Try different filters.</div>
        ) : (
          <div className="card-grid">
            {tests.map((test) => (
              <TestCard key={test._id} test={test} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
