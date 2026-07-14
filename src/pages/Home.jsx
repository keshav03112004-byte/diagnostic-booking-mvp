import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { testAPI, packageAPI, diseaseAPI } from '../api/api';
import TestCard from '../components/TestCard';
import PackageCard from '../components/PackageCard';
import DiseaseCard from '../components/DiseaseCard';
import PincodeChecker from '../components/PincodeChecker';
import HeroSearch from '../components/HeroSearch';
import HeroVideoBackground from '../components/HeroVideoBackground';
import FloatingCTA from '../components/FloatingCTA';
import CtaBubbleBackground from '../components/CtaBubbleBackground';
import { useInquiryModal } from '../context/InquiryModalContext';
import { siteConfig, heroStats as defaultStats, heroTags as defaultTags, heroVideo as defaultVideo } from '../config/siteConfig';
import { cmsAPI } from '../api/api';
import { Activity, Package, Zap, Compass, ChevronRight, Droplet, User, Users, CheckCircle, Inbox, Home as HomeIcon, MessageSquare, ShieldCheck, Phone, ArrowUpRight, Pill, ScanLine } from 'lucide-react';
import { motion } from 'motion/react';
import '../components/cards.css';
import './Home.css';

const VALUE_PROPS = [
  {
    icon: HomeIcon,
    title: 'Free Home Collection',
    desc: 'Within 60 minutes of booking*',
  },
  {
    icon: Activity,
    title: 'Smart Digital Reports',
    desc: 'Real-time tracking & delivery',
  },
  {
    icon: MessageSquare,
    title: 'Free Report Counselling',
    desc: 'Expert guidance on your results',
  },
];

const STAT_CARD_TONES = ['one', 'two', 'three', 'four'];

const HOW_IT_WORKS_CYCLE_MS = 9000;

const HOW_IT_WORKS_STEPS = [
  {
    icon: Pill,
    title: 'Book Online',
    desc: 'Choose tests or packages and pick a convenient time slot',
  },
  {
    icon: ScanLine,
    title: 'Home Collection',
    desc: 'Certified phlebotomist visits your doorstep for sample collection',
  },
  {
    icon: ShieldCheck,
    title: 'Get Smart Report',
    desc: 'Digital report with expert counselling delivered within 24 hours',
  },
];

const SERVICE_TILES = [
  { 
    icon: Activity, 
    title: 'Individual Blood Tests', 
    desc: 'Explore 120+ specialized biomarkers, blood profiles & clinical assays.',
    offer: 'Up to 60% OFF', 
    link: '/tests', 
    color: 'var(--primary)',
    bgColor: 'rgba(var(--primary-rgb), 0.04)',
    borderColor: 'rgba(var(--primary-rgb), 0.1)'
  },
  { 
    icon: Package, 
    title: 'Curated Health Packages', 
    desc: 'Comprehensive full-body checkup panels customized for your lifestyle.',
    offer: 'Best Value Deals', 
    link: '/packages', 
    color: 'var(--accent)',
    bgColor: 'rgba(var(--accent-rgb), 0.04)',
    borderColor: 'rgba(var(--accent-rgb), 0.1)'
  },
  { 
    icon: Zap, 
    title: '2-Minute Quick Book', 
    desc: 'Directly upload prescriptions or list tests for instantaneous home collection.',
    offer: 'Instant Dispatch', 
    link: '/book/quick', 
    color: 'var(--primary)',
    bgColor: 'rgba(var(--primary-rgb), 0.04)',
    borderColor: 'rgba(var(--primary-rgb), 0.1)'
  },
  { 
    icon: Compass, 
    title: 'Browse by Health Concerns', 
    desc: 'Find targeted clinical programs by organ, condition or lifestyle symptoms.',
    offer: '10+ Specialities', 
    link: '#concerns', 
    color: 'var(--accent-mid)',
    bgColor: 'rgba(var(--accent-mid-rgb), 0.04)',
    borderColor: 'rgba(var(--accent-mid-rgb), 0.1)'
  },
];

const TRUST_STATS = [
  { value: '10K+', label: 'Happy Patients' },
  { value: '13+', label: 'Lab Tests' },
  { value: '24h', label: 'Report TAT' },
  { value: 'NABL', label: 'Accredited Labs' },
];

const brandIconProps = { size: 16, color: 'var(--primary)', strokeWidth: 2.25 };

const getTagIcon = (tag) => {
  const t = tag.toLowerCase();
  if (t.includes('blood')) return <Droplet {...brandIconProps} />;
  if (t.includes('body') || t.includes('checkup')) return <User {...brandIconProps} />;
  if (t.includes('home') || t.includes('collection')) return <HomeIcon {...brandIconProps} />;
  if (t.includes('counselling') || t.includes('chat') || t.includes('free')) return <MessageSquare {...brandIconProps} />;
  return null;
};

export default function Home() {
  const { openInquiryModal } = useInquiryModal();
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
  const howWorksRef = useRef(null);
  const howCycleStartRef = useRef(Date.now());
  const howLineFillRef = useRef(null);
  const [activeHowStep, setActiveHowStep] = useState(0);
  const [howInView, setHowInView] = useState(false);
  const [ctaPointer, setCtaPointer] = useState({ x: 0.5, y: 0.5 });

  const jumpToHowStep = useCallback((index) => {
    const stepCount = HOW_IT_WORKS_STEPS.length;
    const segment = 100 / stepCount;
    const progress = Math.min(100, segment * index + segment * 0.55);
    howCycleStartRef.current = Date.now() - (progress / 100) * HOW_IT_WORKS_CYCLE_MS;
    if (howLineFillRef.current) {
      howLineFillRef.current.style.height = `${progress}%`;
    }
    setActiveHowStep(index);
  }, []);

  useEffect(() => {
    if (loading) return undefined;

    const node = howWorksRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          howCycleStartRef.current = Date.now();
          setHowInView(true);
        } else {
          setHowInView(false);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    if (!howInView) return undefined;

    let frameId = 0;
    let lastStep = -1;

    const tick = () => {
      const elapsed = (Date.now() - howCycleStartRef.current) % HOW_IT_WORKS_CYCLE_MS;
      const progress = (elapsed / HOW_IT_WORKS_CYCLE_MS) * 100;
      const stepIndex = Math.min(
        HOW_IT_WORKS_STEPS.length - 1,
        Math.floor(progress / (100 / HOW_IT_WORKS_STEPS.length))
      );

      if (howLineFillRef.current) {
        howLineFillRef.current.style.height = `${progress}%`;
      }

      if (stepIndex !== lastStep) {
        lastStep = stepIndex;
        setActiveHowStep(stepIndex);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [howInView]);

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
        setPopularTests(popularTestsRes.data.tests || []);
        setPopularPackages(popularPackagesRes.data.packages || []);
        setAllTests(allTestsRes.data.tests || []);
        setAllPackages(allPackagesRes.data.packages || []);
        setDiseases(diseasesRes.data.diseases || []);
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
      .catch((err) => {
        console.error('Failed to load home data:', err?.message || err);
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

        <div className="container hero-video-container-inner">
          <div className="hero-video-content">
            <span className="hero-badge-pulse">
              {hero.badge}
            </span>

            <h1 className="hero-video-title">
              {hero.tagline}
              <br />
              <span className="hero-highlight">
                {hero.taglineHighlight.toLowerCase().startsWith('at ') ? (
                  <>
                    <span style={{ color: '#ffffff', fontWeight: 800 }}>at </span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{hero.taglineHighlight.substring(3)}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{hero.taglineHighlight}</span>
                )}
              </span>
            </h1>

            <p className="hero-video-desc">{hero.description}</p>

            <div className="hero-tags">
              {hero.heroTags.map((tag) => (
                <span key={tag} className="hero-tag">
                  {getTagIcon(tag)}
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() =>
                  openInquiryModal({
                    subject: 'Booking Inquiry',
                    message: 'I would like to book a diagnostic test or health package.',
                  })
                }
              >
                <Zap size={16} color="#fff" strokeWidth={2.25} fill="#fff" />
                Quick Book Now
              </button>
              <Link to="/packages" className="btn btn-secondary-light btn-lg">
                View Health Packages
              </Link>
            </div>

            <div className="hero-search-wrap">
              <HeroSearch tests={allTests} packages={allPackages} />
            </div>

            <div className="hero-secure-badge">
              <ShieldCheck size={18} color="var(--primary)" strokeWidth={2.25} />
              <span>Your data is secure & confidential</span>
            </div>
          </div>
        </div>


      </section>

      {/* Stats — Breazen-style pastel cards, brand theme */}
      <section className="section section-hero-stats">
        <div className="container">
          <div className="hero-stats-row">
            {hero.heroStats.map((stat, index) => {
              const iconMap = { User, Users, CheckCircle, Inbox };
              const Icon = iconMap[stat.icon] || Activity;
              const tone = STAT_CARD_TONES[index % STAT_CARD_TONES.length];
              return (
                <article key={stat.label} className={`hero-stat-card tone-${tone}`}>
                  <div className="stat-card-top">
                    <span className="stat-label">{stat.label}</span>
                    <span className="stat-icon-bubble" aria-hidden="true">
                      <Icon size={16} strokeWidth={2.25} />
                    </span>
                  </div>
                  <strong className="stat-value">{stat.value}</strong>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value props — wide achievement-style strip */}
      <section className="section section-value-strip">
        <div className="container">
          <div className="value-strip-banner">
            <p className="value-strip-kicker">Why book with energex.life</p>
            <div className="value-strip-inner">
              {VALUE_PROPS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="value-item">
                    <span className="value-icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={2.25} />
                    </span>
                    <div className="value-copy">
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Service tiles — bento layout (content unchanged) */}
      <section className="section modern-service-tiles-section">
        <div className="services-bento-glow" aria-hidden="true" />
        <div className="container services-bento-inner">
          <header className="modern-tiles-header">
            <div className="modern-tiles-header-copy">
              <span className="modern-tiles-tagline">✨ INTEGRATED DIAGNOSTICS</span>
              <h2 className="modern-tiles-title">
                Precision Diagnostic <em>Ecosystem</em>
              </h2>
            </div>
            <p className="modern-tiles-subtitle">
              Seamlessly bridge the gap between advanced pathology instrumentation and the comfort of your home.
            </p>
          </header>

          <div className="services-bento-grid">
            {/* Featured — Individual Blood Tests */}
            <Link
              to={SERVICE_TILES[0].link}
              className="bento-card bento-feature"
            >
              <div className="bento-feature-media" aria-hidden="true" />
              <div className="bento-feature-overlay" aria-hidden="true" />
              <div className="bento-feature-content">
                <span className="bento-pill bento-pill-glass">{SERVICE_TILES[0].offer}</span>
                <h3>{SERVICE_TILES[0].title}</h3>
                <p>{SERVICE_TILES[0].desc}</p>
                <span className="bento-cta">
                  Explore pathway
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </span>
              </div>
            </Link>

            {/* Health Packages */}
            <Link
              to={SERVICE_TILES[1].link}
              className="bento-card bento-packages"
            >
              <div className="bento-card-top">
                <span className="bento-pill bento-pill-dark">{SERVICE_TILES[1].offer}</span>
                <Package size={22} strokeWidth={1.75} className="bento-corner-icon" />
              </div>
              <div className="bento-card-copy">
                <h3>{SERVICE_TILES[1].title}</h3>
                <p>{SERVICE_TILES[1].desc}</p>
              </div>
            </Link>

            {/* Browse by Health Concerns */}
            <Link
              to={SERVICE_TILES[3].link}
              className="bento-card bento-concern"
            >
              <Compass size={22} strokeWidth={1.75} className="bento-corner-icon" />
              <div className="bento-card-copy">
                <h3>{SERVICE_TILES[3].title}</h3>
                <p>{SERVICE_TILES[3].desc}</p>
              </div>
            </Link>

            {/* Quick Book */}
            <button
              type="button"
              className="bento-card bento-quick"
              onClick={() =>
                openInquiryModal({
                  subject: 'Quick Book Inquiry',
                  message: 'I want to upload a prescription or list tests for home collection.',
                })
              }
            >
              <Zap size={22} strokeWidth={1.75} className="bento-corner-icon" />
              <div className="bento-card-copy">
                <h3>{SERVICE_TILES[2].title}</h3>
                <p>{SERVICE_TILES[2].desc}</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Popular Tests — Most Booked */}
      <section className="section section-popular-tests">
        <div className="popular-tests-glow" aria-hidden="true" />
        <div className="container popular-tests-inner">
          <header className="popular-tests-header">
            <div className="popular-tests-header-copy">
              <span className="popular-tests-eyebrow">MOST BOOKED</span>
              <h2 className="popular-tests-title">
                Popular <em>tests</em>, ready to book.
              </h2>
            </div>
            <Link to="/tests" className="btn btn-primary">
              View all tests
              <ArrowUpRight size={15} strokeWidth={2.75} />
            </Link>
          </header>

          <div className="popular-tests-grid">
            {popularTests.slice(0, 8).map((test) => (
              <TestCard key={test._id} test={test} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Packages — Full Body Checkups */}
      <section className="section section-packages">
        <div className="packages-glow" aria-hidden="true" />
        <div className="container packages-inner">
          <header className="packages-header">
            <div className="packages-header-copy">
              <span className="packages-eyebrow">FULL BODY CHECKUPS</span>
              <h2 className="packages-title">
                Packages that <em>say a lot</em>,
                <br />
                for a little.
              </h2>
            </div>
            <p className="packages-lede">
              Physician-curated bundles that screen you head-to-toe. Save up to 82% versus individual tests, with the same NABL quality.
            </p>
          </header>

          <div className="packages-grid">
            {popularPackages.slice(0, 4).map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} variant="featured" />
            ))}
          </div>

          <div className="packages-cta">
            <Link to="/packages" className="btn btn-primary btn-lg">
              Explore all packages
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by disease / concern */}
      <section className="section section-concerns" id="concerns">
        <div className="concerns-glow" aria-hidden="true" />
        <div className="container concerns-inner">
          <header className="concerns-header">
            <div className="concerns-header-copy">
              <span className="concerns-eyebrow">BY CONCERN</span>
              <h2 className="concerns-title">
                Not sure where to start?
                <em>Start with a symptom.</em>
              </h2>
            </div>
            <p className="concerns-lede">
              Browse tests and packages grouped by condition — heart, thyroid, diabetes and more.
            </p>
          </header>

          <div className="concerns-grid">
            {diseases.map((disease) => (
              <DiseaseCard key={disease._id} disease={disease} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="section section-trust">
        <div className="trust-glow" aria-hidden="true" />
        <div className="container trust-inner">
          <div className="trust-content">
            <span className="trust-eyebrow">Why Choose energex.life</span>
            <h2 className="trust-title">
              Why Thousands Trust <em>energex.life</em> Labs
            </h2>
            <ul className="trust-list">
              <li><span aria-hidden="true">✓</span> NABL accredited partner laboratories</li>
              <li><span aria-hidden="true">✓</span> Certified phlebotomists for safe collection</li>
              <li><span aria-hidden="true">✓</span> Smart reports delivered within 24 hours</li>
              <li><span aria-hidden="true">✓</span> Free expert report counselling included</li>
              <li><span aria-hidden="true">✓</span> Transparent pricing — no hidden charges</li>
            </ul>
            <Link to="/register" className="btn btn-primary btn-lg trust-cta">
              Get Started Free
            </Link>
          </div>
          <div className="trust-stats">
            {TRUST_STATS.map((stat, index) => (
              <div key={stat.label} className={`trust-stat tone-${(index % 4) + 1}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — image-matched layout */}
      <section className="section section-how-it-works" ref={howWorksRef}>
        <div className="how-works-glow" aria-hidden="true" />
        <div className="container">
          <header className="how-section-header">
            <span className="how-eyebrow">Simple Steps</span>
            <h2 className="how-process-title">
              How it <em>works</em>
            </h2>
            <p className="how-process-lede">
              No confusion or delays. Just fast and reliable testing.
            </p>
          </header>

          <div className="how-process-layout">
            <div className="how-visual">
              <div className="how-visual-photo-wrap">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=960&q=80"
                  alt="Healthcare consultant ready to help you book diagnostic tests"
                  className="how-visual-photo"
                />
              </div>

              <div className="how-visual-callout">
                <span className="how-callout-pill">Book Online</span>
                <svg
                  className="how-callout-arrow"
                  viewBox="0 0 96 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Curved shaft */}
                  <path
                    d="M12 10 C 28 10, 42 14, 54 28 C 64 40, 70 50, 74 58"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                  />
                  {/* Arrowhead pointing down-right */}
                  <path
                    d="M62 48 L74 58 L82 44"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="how-visual-card">
                <h3 className="how-visual-card-title">Test Kits</h3>
                <div className="how-visual-kit-grid">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="how-kit-item" aria-hidden="true">
                      <span className="how-kit-thumb" />
                      <span className="how-kit-line how-kit-line-lg" />
                      <span className="how-kit-line" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="how-steps-rail">
              <div className="how-rail-line-wrap" aria-hidden="true">
                <span className="how-rail-line-bg" />
                <span
                  ref={howLineFillRef}
                  className="how-rail-line-fill"
                />
              </div>

              {HOW_IT_WORKS_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeHowStep;
                return (
                  <article
                    key={step.title}
                    className={`how-rail-step${isActive ? ' is-active' : ''}`}
                    onClick={() => jumpToHowStep(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        jumpToHowStep(index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <div className="how-rail-marker">
                      <span className={`how-rail-icon${isActive ? ' is-accent' : ''}`}>
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                    </div>
                    <div className="how-rail-copy">
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section cta-banner">
        <div className="container">
          <div
            className="cta-banner-panel"
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              if (!rect.width || !rect.height) return;
              setCtaPointer({
                x: (event.clientX - rect.left) / rect.width,
                y: (event.clientY - rect.top) / rect.height,
              });
            }}
            onPointerLeave={() => setCtaPointer({ x: 0.5, y: 0.5 })}
          >
            <CtaBubbleBackground pointer={ctaPointer} />
            <div className="cta-banner-glow" aria-hidden="true" />
            <div className="cta-banner-inner">
              <div className="cta-banner-copy">
                <h2 className="cta-banner-title">
                  Take charge
                  <br />
                  of your health <em>today.</em>
                </h2>
                <p className="cta-banner-subtitle">
                  Your first home collection is on us. Book a test in under two minutes.
                </p>
              </div>
              <div className="cta-banner-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() =>
                    openInquiryModal({
                      subject: 'Booking Inquiry',
                      message: 'Please help me book a home collection appointment.',
                    })
                  }
                >
                  Book Test Now
                  <ArrowUpRight size={16} strokeWidth={2.75} />
                </button>
                <a href="tel:+919998880005" className="btn btn-secondary-light btn-lg">
                  <Phone size={15} strokeWidth={2.25} />
                  Call us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloatingCTA />
    </>
  );
}
