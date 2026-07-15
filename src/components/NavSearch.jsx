import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { testAPI } from '../api/api';

export default function NavSearch({ className = '', onNavigate }) {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const [query, setQuery] = useState('');
  const [tests, setTests] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const q = query.toLowerCase().trim();
  const matches = q
    ? tests.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 6)
    : [];

  useEffect(() => {
    if (loaded) return undefined;
    let cancelled = false;
    testAPI
      .getAll()
      .then((res) => {
        if (!cancelled) {
          setTests(res.data.tests || []);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [loaded]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const go = (path) => {
    setOpen(false);
    setQuery('');
    onNavigate?.();
    navigate(path);
  };

  const submit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (matches.length === 1) {
      go(`/tests/${matches[0].slug}`);
      return;
    }
    go(`/tests?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div ref={wrapRef} className={`nav-search ${className}`.trim()}>
      <form className="nav-search-form" onSubmit={submit} role="search">
        <Search className="nav-search-icon" size={15} strokeWidth={2.25} aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder="Search tests..."
          aria-label="Search tests"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        <button type="submit" className="nav-search-btn" aria-label="Search tests">
          <Search size={14} strokeWidth={2.5} />
        </button>
      </form>

      {open && q && (
        <div className="nav-search-results">
          {matches.length === 0 ? (
            <button
              type="button"
              className="nav-search-empty"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(`/tests?search=${encodeURIComponent(query.trim())}`)}
            >
              Search all tests for “{query.trim()}”
            </button>
          ) : (
            matches.map((test) => (
              <button
                key={test._id}
                type="button"
                className="nav-search-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(`/tests/${test.slug}`)}
              >
                <span className="nav-search-item-name">{test.name}</span>
                <span className="nav-search-item-price">₹{test.price}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
