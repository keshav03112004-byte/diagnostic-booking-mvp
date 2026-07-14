import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './HeroSearch.css';

export default function HeroSearch({ tests = [], packages = [] }) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const q = query.toLowerCase().trim();
  const matchedTests = q
    ? tests.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 5)
    : [];
  const matchedPackages = q
    ? packages.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3)
    : [];
  const hasResults = matchedTests.length > 0 || matchedPackages.length > 0;

  const goTo = (path) => {
    setShowResults(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="hero-search">
      <div className="hero-search-box">
        <Search className="search-icon w-5 h-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search tests, packages — Thyroid, CBC, Diabetes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {query && (
          <button type="button" className="search-clear" onClick={() => setQuery('')}>
            ×
          </button>
        )}
      </div>

      {showResults && q && (
        <div className="hero-search-results">
          {!hasResults ? (
            <div className="search-empty">
              No results for &ldquo;{query}&rdquo; —{' '}
              <button type="button" onClick={() => goTo(`/tests?search=${encodeURIComponent(query)}`)}>
                browse all tests
              </button>
            </div>
          ) : (
            <>
              {matchedTests.map((test) => (
                <button
                  key={test._id}
                  type="button"
                  className="search-result-item"
                  onMouseDown={() => goTo(`/tests/${test.slug}`)}
                >
                  <span className="result-type">Test</span>
                  <span className="result-name">{test.name}</span>
                  <span className="result-price">₹{test.price}</span>
                </button>
              ))}
              {matchedPackages.map((pkg) => (
                <button
                  key={pkg._id}
                  type="button"
                  className="search-result-item"
                  onMouseDown={() => goTo(`/packages/${pkg.slug}`)}
                >
                  <span className="result-type package">Package</span>
                  <span className="result-name">{pkg.name}</span>
                  <span className="result-price">₹{pkg.price}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
