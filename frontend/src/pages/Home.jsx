import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { testAPI, packageAPI, diseaseAPI } from '../api/api';
import TestCard from '../components/TestCard';
import PackageCard from '../components/PackageCard';
import DiseaseCard from '../components/DiseaseCard';
import PincodeChecker from '../components/PincodeChecker';
import HeroSearch from '../components/HeroSearch';
import HeroVideoBackground from '../components/HeroVideoBackground';
import FloatingCTA from '../components/FloatingCTA';
import { siteConfig, heroStats as defaultStats, heroTags as defaultTags, heroVideo as defaultVideo } from '../config/siteConfig';
import { cmsAPI } from '../api/api';
import '../components/cards.css';
import './Home.css';

const VALUE_PROPS = [
  {
    icon: '🏠',
    title: 'Free Home Collection',
    desc: 'Within 60 minutes of booking*',
  },
  {
    icon: '📊',
    title: 'Smart Digital Reports',
    desc: 'Real-time tracking & delivery',
  },
  {
    icon: '👨‍⚕️',
    title: 'Free Report Counselling',
    desc: 'Expert guidance on your results',
  },
];

const SERVICE_TILES = [
  { icon: '🩸', title: 'Blood Tests', offer: 'Up to 60% off', link: '/tests', color: '#FF6B4A' },
  { icon: '📦', title: 'Health Packages', offer: 'Best value deals', link: '/packages', color: '#5B4FD9' },
  { icon: '⚡', title: 'Quick Book', offer: '2-min booking', link: '/book/quick', color: '#0EA5E9' },
  { icon: '🔬', title: 'By Health Concern', offer: '10+ categories', link: '#concerns', color: '#10B981' },
];

const TRUST_STATS = [
  { value: '10K+', label: 'Happy Patients' },
  { value: '13+', label: 'Lab Tests' },
  { value: '24h', label: 'Report TAT' },
  { value: 'NABL', label: 'Accredited Labs' },
];

export default function Home() {
  const [popularTests, setPopularTests] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState({
    badge: siteConfig.badge,
    tagline: siteConfig.tagline,
    taglineHighlight: siteConfig.taglineHighlight,
    description: siteConfig.description,
    heroVideo: defaultVideo,
    heroStats: defaultStats,
    heroTags: defaultTags,
  });

  useEffect(() => {
    Promise.all([
      testAPI.getPopular(),
      packageAPI.getPopular(),
      testAPI.getAll(),
      packageAPI.getAll(),
      diseaseAPI.getAll(),
      cmsAPI.getHero().catch(() => null),
    ])
      .then(([popularTestsRes, popularPackagesRes, allTestsRes, allPackagesRes, diseasesRes, heroRes]) => {
        setPopularTests(popularTestsRes.data.tests);
        setPopularPackages(popularPackagesRes.data.packages);
        setAllTests(allTestsRes.data.tests);
        setAllPackages(allPackagesRes.data.packages);
        setDiseases(diseasesRes.data.diseases);
        if (heroRes?.data) {
          setHero({
            badge: heroRes.data.badge,
            tagline: heroRes.data.tagline,
            taglineHighlight: heroRes.data.taglineHighlight,
            description: heroRes.data.description,
            heroVideo: heroRes.data.heroVideo,
            heroStats: heroRes.data.heroStats,
            heroTags: heroRes.data.heroTags,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        Loading your health dashboard...
      </div>
    );
  }

  return (
    <>
      {/* Hero with video background (Neo Block style) */}
      <section className="hero hero-video-section">
        <HeroVideoBackground video={hero.heroVideo} />

        <div className="container hero-video-content">
          <span className="hero-badge hero-badge-pulse">
            <span className="pulse-dot" />
            {hero.badge}
          </span>

          <h1 className="hero-video-title">
            {hero.tagline}
            <br />
            <span className="hero-highlight">{hero.taglineHighlight}</span>
          </h1>

          <p className="hero-video-desc">{hero.description}</p>

          <div className="hero-tags">
            {hero.heroTags.map((tag) => (
              <span key={tag} className="hero-tag">{tag}</span>
            ))}
          </div>

          <div className="hero-actions hero-actions-center">
            <Link to="/book/quick" className="btn btn-primary btn-lg">
              ⚡ Quick Book Now
            </Link>
            <Link to="/packages" className="btn btn-hero-outline btn-lg">
              View Health Packages
            </Link>
          </div>

          <div className="hero-search-wrap">
            <HeroSearch tests={allTests} packages={allPackages} />
          </div>

          <div className="hero-pincode hero-pincode-center">
            <span className="pincode-label">📍 Check home collection in your area</span>
            <PincodeChecker variant="hero" />
          </div>

          <div className="hero-stats-row">
            {hero.heroStats.map((stat) => (
              <div key={stat.label} className="hero-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props strip */}
      <section className="value-strip">
        <div className="container value-strip-inner">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="value-item">
              <span className="value-icon">{item.icon}</span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service category tiles */}
      <section className="section service-tiles-section">
        <div className="container">
          <div className="service-tiles">
            {SERVICE_TILES.map((tile) => (
              <Link
                key={tile.title}
                to={tile.link}
                className="service-tile"
                style={{ '--tile-color': tile.color }}
              >
                <span className="service-tile-icon">{tile.icon}</span>
                <h3>{tile.title}</h3>
                <span className="service-tile-offer">{tile.offer}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tests */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Most Demanding</span>
            <h2 className="section-title">Popular Diagnostic Tests</h2>
            <p className="section-subtitle">
              High-demand tests trusted by thousands — with free home collection
            </p>
          </div>
          <div className="card-grid">
            {popularTests.slice(0, 8).map((test) => (
              <TestCard key={test._id} test={test} />
            ))}
          </div>
          <div className="section-cta">
            <Link to="/tests" className="btn btn-indigo">View All Tests →</Link>
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="section section-packages">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Save More</span>
            <h2 className="section-title">Popular Health Packages</h2>
            <p className="section-subtitle">
              Curated checkup bundles — more tests, better value
            </p>
          </div>
          <div className="card-grid">
            {popularPackages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
          <div className="section-cta">
            <Link to="/packages" className="btn btn-indigo">View All Packages →</Link>
          </div>
        </div>
      </section>

      {/* Browse by disease */}
      <section className="section" id="concerns">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Find What You Need</span>
            <h2 className="section-title">Browse by Health Concern</h2>
            <p className="section-subtitle">
              Tests and packages organized by disease and health condition
            </p>
          </div>
          <div className="card-grid disease-grid">
            {diseases.map((disease) => (
              <DiseaseCard key={disease._id} disease={disease} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="section trust-section">
        <div className="container">
          <div className="trust-inner">
            <div className="trust-content">
              <span className="section-label light">Why Choose DiagBook</span>
              <h2 className="trust-title">Why Thousands Trust DiagBook Labs</h2>
              <ul className="trust-list">
                <li><span>✓</span> NABL accredited partner laboratories</li>
                <li><span>✓</span> Certified phlebotomists for safe collection</li>
                <li><span>✓</span> Smart reports delivered within 24 hours</li>
                <li><span>✓</span> Free expert report counselling included</li>
                <li><span>✓</span> Transparent pricing — no hidden charges</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            </div>
            <div className="trust-stats">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label} className="trust-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Simple Process</span>
            <h2 className="section-title">Your Health Checkup Journey</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-visual">📱</div>
              <span className="step-num">Step 1</span>
              <h3>Book Online</h3>
              <p>Choose tests or packages and pick a convenient time slot</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-visual">🏠</div>
              <span className="step-num">Step 2</span>
              <h3>Home Collection</h3>
              <p>Certified phlebotomist visits your doorstep for sample collection</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-visual">📋</div>
              <span className="step-num">Step 3</span>
              <h3>Get Smart Report</h3>
              <p>Digital report with expert counselling delivered within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <div>
            <h2>Ready to Take Charge of Your Health?</h2>
            <p>Book your first test today — home collection is completely free.</p>
          </div>
          <Link to="/book/quick" className="btn btn-primary btn-lg">
            Book Test Now →
          </Link>
        </div>
      </section>

      <FloatingCTA />
    </>
  );
}
