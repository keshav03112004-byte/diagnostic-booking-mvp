import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { packageAPI, diseaseAPI } from '../api/api';
import PackageCard from '../components/PackageCard';
import '../components/cards.css';

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const disease = searchParams.get('disease') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    diseaseAPI.getAll().then((res) => setDiseases(res.data.diseases));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    packageAPI
      .getAll({ search: search || undefined, disease: disease || undefined, sort: sort || undefined })
      .then((res) => setPackages(res.data.packages))
      .catch(() => setError('Could not load packages. Start backend: cd backend && npm run dev. Then run: npm run seed'))
      .finally(() => setLoading(false));
  }, [search, disease, sort]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setSearch(query.trim());
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Health Checkup Packages</h1>
          <p>Curated packages with multiple tests at discounted prices</p>
        </div>
      </div>

      <div className="container section">
        <div className="filters">
          <form className="filter-search-field" onSubmit={submitSearch} role="search">
            <input
              type="search"
              placeholder="Search packages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="filter-search"
              aria-label="Search packages"
            />
            <button type="submit" className="filter-search-btn" aria-label="Search packages">
              <Search size={15} strokeWidth={2.5} aria-hidden="true" />
              <span>Search</span>
            </button>
          </form>
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
          <div className="loading">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="empty-state">No packages found.</div>
        ) : (
          <div className="card-grid">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
