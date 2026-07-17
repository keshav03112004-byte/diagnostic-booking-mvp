import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { testAPI, packageAPI, diseaseAPI } from '../api/api';
import TestCard from '../components/TestCard';
import PackageCard from '../components/PackageCard';
import DiseaseCard from '../components/DiseaseCard';
import PincodeChecker from '../components/PincodeChecker';
import FloatingCTA from '../components/FloatingCTA';
import CtaBubbleBackground from '../components/CtaBubbleBackground';
import FAQAccordion from '../components/FAQAccordion';
import ScrollReveal from '../components/ScrollReveal';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { siteConfig, heroStats, heroTags } from '../config/siteConfig';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  Activity,
  Zap,
  Compass,
  Droplet,
  User,
  Users,
  CheckCircle,
  Inbox,
  Home as HomeIcon,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Pill,
  ScanLine,
  FlaskConical,
  ClipboardList,
  Clock,
  FileText,
  BadgeCheck,
  Syringe,
  IndianRupee,
  Stethoscope,
} from 'lucide-react';
import { motion } from 'motion/react';
import '../components/cards.css';
import './Home.css';

const CONCERN_TABS = [
  {
    id: 'specialties',
    label: 'Specialties',
    slugs: ['heart', 'kidney', 'liver', 'thyroid', 'vitamins', 'pregnancy'],
  },
  {
    id: 'conditions',
    label: 'Conditions',
    slugs: ['anaemia', 'arthritis', 'diabetes', 'fever', 'thyroid', 'heart'],
  },
  {
    id: 'procedures',
    label: 'Procedures',
    slugs: ['pregnancy', 'vitamins', 'diabetes', 'kidney', 'liver', 'anaemia'],
  },
];

const HOW_IT_WORKS_CYCLE_MS = 9000;

const HOME_FAQS = [
  {
    question: 'Do you offer home sample collection?',
    answer:
      'Yes. A certified phlebotomist visits your doorstep at your chosen slot. Home collection is available across our serviceable pincodes.',
  },
  {
    question: 'How soon will I get my reports?',
    answer:
      'Most reports are delivered digitally within 24 hours. You’ll get a secure link by SMS and email as soon as results are ready.',
  },
  {
    question: 'Are the labs accredited?',
    answer:
      'We partner with NABL-accredited laboratories for testing quality and reliability. Every sample is handled with chain-of-custody care.',
  },
  {
    question: 'Can I book without creating an account?',
    answer:
      'Yes. Tap Book Now or Quick Book to chat with us on WhatsApp — no account is required. Our team will confirm your slot and guide you through the rest.',
  },
  {
    question: 'Is report counselling included?',
    answer:
      'Yes. Free report counselling is available so you can understand your markers and next steps with clear, practical guidance.',
  },
  {
    question: 'Which areas do you currently serve?',
    answer:
      'We currently serve Gurgaon, Delhi NCR, and Bangalore. Enter your pincode on the site to confirm home collection availability.',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: Pill,
    title: 'Book Online',
    desc: 'Choose tests or packages and pick a convenient time slot',
    image: '/images/how-it-works-consultant.png',
    alt: 'Healthcare consultant ready to help you book diagnostic tests',
  },
  {
    icon: ScanLine,
    title: 'Home Collection',
    desc: 'Certified phlebotomist visits your doorstep for sample collection',
    image: '/images/how-it-works-collection.png',
    alt: 'Certified phlebotomist collecting a sample at home',
  },
  {
    icon: ShieldCheck,
    title: 'Get Smart Report',
    desc: 'Digital report with expert counselling delivered within 24 hours',
    image: '/images/how-it-works-report.png',
    alt: 'Patient reviewing a smart digital lab report',
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
    icon: HomeIcon, 
    title: 'Free Sample Collections', 
    desc: 'Complimentary home sample collection with every booking — certified phlebotomists at your doorstep.',
    offer: 'Always Free', 
    link: '/book/quick', 
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
  { value: '10K+', label: 'Happy Patients', Icon: Users },
  { value: '13+', label: 'Lab Tests', Icon: FlaskConical },
  { value: '24h', label: 'Report TAT', Icon: Clock },
  { value: 'NABL', label: 'Accredited Labs', Icon: BadgeCheck },
];

const TRUST_FEATURES = [
  {
    title: 'NABL accredited labs',
    detail: 'Partner laboratories with accredited quality systems you can trust.',
    Icon: BadgeCheck,
  },
  {
    title: 'Certified collection',
    detail: 'Trained phlebotomists for safe, hygienic home sample collection.',
    Icon: Syringe,
  },
  {
    title: 'Smart reports in 24h',
    detail: 'Clear digital reports delivered quickly, usually within a day.',
    Icon: FileText,
  },
  {
    title: 'Expert counselling',
    detail: 'Free report counselling so results are easy to understand.',
    Icon: Stethoscope,
  },
  {
    title: 'Transparent pricing',
    detail: 'Upfront costs with no hidden charges at checkout.',
    Icon: IndianRupee,
  },
];

const brandIconProps = { size: 14, color: 'var(--primary)', strokeWidth: 2.25 };

const getTagIcon = (tag) => {
  const t = tag.toLowerCase();
  if (t.includes('blood') || t.includes('lab')) return <Droplet {...brandIconProps} />;
  if (t.includes('body') || t.includes('checkup')) return <User {...brandIconProps} />;
  if (t.includes('home') || t.includes('collection') || t.includes('sample')) return <HomeIcon {...brandIconProps} />;
  if (t.includes('counselling') || t.includes('chat') || t.includes('free')) return <MessageSquare {...brandIconProps} />;
  return null;
};

export default function Home() {
  const whatsappUrl = getWhatsAppUrl();
  const [popularTests, setPopularTests] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const hero = {
    badge: siteConfig.badge,
    tagline: siteConfig.tagline,
    taglineHighlight: siteConfig.taglineHighlight,
    description: siteConfig.description,
    heroStats,
    heroTags,
  };
  const howWorksRef = useRef(null);
  const howCycleStartRef = useRef(Date.now());
  const howLineFillRef = useRef(null);
  const [activeHowStep, setActiveHowStep] = useState(0);
  const [howInView, setHowInView] = useState(false);
  const [ctaPointer, setCtaPointer] = useState({ x: 0.5, y: 0.5 });
  const [concernTab, setConcernTab] = useState('specialties');
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [popularLoopIdx, setPopularLoopIdx] = useState(0);
  const [popularPaused, setPopularPaused] = useState(false);
  const popularTrackRef = useRef(null);
  const popularJumpingRef = useRef(false);
  const popularReadyRef = useRef(false);
  const popularAnimatingRef = useRef(false);
  const concernRailRef = useRef(null);
  const [concernScroll, setConcernScroll] = useState({
    canScroll: false,
    progress: 0,
    atStart: true,
    atEnd: true,
  });

  const updateConcernScroll = useCallback(() => {
    const el = concernRailRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const canScroll = maxScroll > 8;
    const ratio = canScroll ? el.scrollLeft / maxScroll : 0;
    setConcernScroll({
      canScroll,
      progress: canScroll ? Math.min(100, Math.max(12, ratio * 100)) : 0,
      atStart: el.scrollLeft <= 8,
      atEnd: el.scrollLeft >= maxScroll - 8,
    });
  }, []);

  const scrollConcernsBy = useCallback((direction) => {
    const el = concernRailRef.current;
    if (!el) return;
    const step = Math.max(168, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = concernRailRef.current;
    if (el) el.scrollLeft = 0;
    setSelectedConcern(null);
  }, [concernTab]);

  useEffect(() => {
    const el = concernRailRef.current;
    if (!el) return undefined;

    updateConcernScroll();
    const frame = requestAnimationFrame(updateConcernScroll);
    const observer = new ResizeObserver(updateConcernScroll);
    observer.observe(el);
    el.addEventListener('scroll', updateConcernScroll, { passive: true });
    window.addEventListener('resize', updateConcernScroll);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener('scroll', updateConcernScroll);
      window.removeEventListener('resize', updateConcernScroll);
    };
  }, [concernTab, diseases, updateConcernScroll]);

  const popularCarouselTests = useMemo(() => popularTests.slice(0, 8), [popularTests]);
  const popularCount = popularCarouselTests.length;

  const popularLoopSlides = useMemo(() => {
    if (popularCount === 0) return [];
    if (popularCount === 1) {
      return [{ test: popularCarouselTests[0], realIndex: 0, key: `solo-${popularCarouselTests[0]._id}` }];
    }
    return [0, 1, 2].flatMap((copy) =>
      popularCarouselTests.map((test, realIndex) => ({
        test,
        realIndex,
        key: `${copy}-${test._id}`,
      }))
    );
  }, [popularCarouselTests, popularCount]);

  const scrollPopularToIndex = useCallback((index, behavior = 'smooth') => {
    const track = popularTrackRef.current;
    if (!track) return;
    const slide = track.querySelector(`[data-popular-loop="${index}"]`);
    if (!slide) return;

    // Measure after layout so active width is already applied
    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const delta =
      slideRect.left + slideRect.width / 2 - (trackRect.left + trackRect.width / 2);

    if (Math.abs(delta) < 1) return;
    track.scrollTo({ left: track.scrollLeft + delta, behavior });
  }, []);

  const normalizePopularLoopIdx = useCallback((index) => {
    if (popularCount < 2) return index;
    if (index < popularCount) return index + popularCount;
    if (index >= popularCount * 2) return index - popularCount;
    return index;
  }, [popularCount]);

  const stepPopularCarousel = useCallback((direction) => {
    if (popularCount < 2 || popularJumpingRef.current || popularAnimatingRef.current) return;
    popularAnimatingRef.current = true;
    setPopularLoopIdx((idx) => idx + direction);
    window.setTimeout(() => {
      popularAnimatingRef.current = false;
    }, 520);
  }, [popularCount]);

  const focusPopularSlide = useCallback((realIndex) => {
    if (popularCount < 2) {
      setPopularLoopIdx(0);
      return;
    }
    const copy = Math.min(2, Math.max(0, Math.floor(popularLoopIdx / popularCount)));
    popularAnimatingRef.current = true;
    setPopularLoopIdx(copy * popularCount + realIndex);
    window.setTimeout(() => {
      popularAnimatingRef.current = false;
    }, 520);
  }, [popularCount, popularLoopIdx]);

  useEffect(() => {
    if (popularCount === 0) return undefined;
    popularReadyRef.current = false;
    const start = popularCount > 1 ? popularCount : 0;
    popularJumpingRef.current = true;
    setPopularLoopIdx(start);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollPopularToIndex(start, 'auto');
        popularJumpingRef.current = false;
        popularReadyRef.current = true;
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [popularCount, scrollPopularToIndex]);

  useEffect(() => {
    if (!popularReadyRef.current || popularCount < 2) return undefined;

    if (popularJumpingRef.current) {
      requestAnimationFrame(() => {
        scrollPopularToIndex(popularLoopIdx, 'auto');
        popularJumpingRef.current = false;
      });
      return undefined;
    }

    requestAnimationFrame(() => {
      scrollPopularToIndex(popularLoopIdx, 'smooth');
    });

    const isCloneEdge =
      popularLoopIdx < popularCount || popularLoopIdx >= popularCount * 2;

    if (!isCloneEdge) return undefined;

    // After the wrap animation finishes, snap to the matching middle clone
    const wrapTimer = window.setTimeout(() => {
      const normalized = normalizePopularLoopIdx(popularLoopIdx);
      if (normalized === popularLoopIdx) return;
      popularJumpingRef.current = true;
      setPopularLoopIdx(normalized);
    }, 480);

    return () => window.clearTimeout(wrapTimer);
  }, [popularLoopIdx, popularCount, scrollPopularToIndex, normalizePopularLoopIdx]);

  useEffect(() => {
    const onResize = () => {
      if (!popularReadyRef.current) return;
      scrollPopularToIndex(popularLoopIdx, 'auto');
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [popularLoopIdx, scrollPopularToIndex]);

  useEffect(() => {
    if (loading || popularPaused || popularCount < 2) return undefined;
    const timer = window.setInterval(() => {
      stepPopularCarousel(1);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [loading, popularPaused, popularCount, stepPopularCarousel]);

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
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const empty = { data: {} };
    Promise.all([
      testAPI.getPopular().catch(() => empty),
      packageAPI.getPopular().catch(() => empty),
      testAPI.getAll().catch(() => empty),
      packageAPI.getAll().catch(() => empty),
      diseaseAPI.getAll().catch(() => empty),
    ])
      .then(([popularTestsRes, popularPackagesRes, allTestsRes, allPackagesRes, diseasesRes]) => {
        const allTestsData = allTestsRes.data.tests || [];
        const allPackagesData = allPackagesRes.data.packages || [];
        const popularTestsData = popularTestsRes.data.tests || [];
        const popularPackagesData = popularPackagesRes.data.packages || [];
        setPopularTests(popularTestsData.length ? popularTestsData : allTestsData.slice(0, 8));
        setPopularPackages(popularPackagesData.length ? popularPackagesData : allPackagesData.slice(0, 4));
        setDiseases(diseasesRes.data.diseases || []);
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

  const heroStatIconMap = {
    FlaskConical,
    ClipboardList,
    Clock,
    Home: HomeIcon,
    User,
    Users,
    CheckCircle,
    Inbox,
    Activity,
  };

  const heroStatLabelIconMap = {
    'Sample Collection': HomeIcon,
    'Report Delivery': Clock,
    'Home Collection': HomeIcon,
    'Lab Tests': FlaskConical,
  };

  return (
    <>
      <section className="hero hero-split-section">
        <div className="hero-split-bg" aria-hidden="true" />
        <div className="container hero-split-inner">
          <div className="hero-split-copy">
            <span className="hero-split-badge">
              <CheckCircle size={14} strokeWidth={2.4} aria-hidden="true" />
              {hero.badge}
            </span>

            <motion.h1
              className="hero-split-title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {hero.tagline}{' '}
              <span className="hero-split-highlight">{hero.taglineHighlight}</span>
            </motion.h1>

            <motion.p
              className="hero-split-desc"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {hero.description}
            </motion.p>

            <div className="hero-tags">
              {hero.heroTags.map((tag) => (
                <span key={tag} className="hero-tag">
                  {getTagIcon(tag)}
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <a
                href={whatsappUrl}
                className="btn btn-primary btn-lg hero-btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Zap size={15} color="#FACC15" strokeWidth={2.4} fill="#FACC15" />
                Quick Book Now
              </a>
              <Link to="/packages" className="btn btn-lg hero-btn-secondary">
                View Health Packages
              </Link>
            </div>

            <div className="hero-secure-badge">
              <ShieldCheck size={16} color="var(--primary)" strokeWidth={2.25} />
              <span>Your data is secure & confidential</span>
            </div>
          </div>

          <motion.div
            className="hero-split-visual"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-product-stage">
              <div className="hero-product-frame">
                <img
                  src="/images/hero-visual.png"
                  alt="Friendly phlebotomist collecting a blood sample from a relaxed patient at home"
                  className="hero-product-image"
                  width={483}
                  height={519}
                  decoding="async"
                  fetchPriority="high"
                />
              </div>

              <div className="hero-inline-stats hero-inline-stats-on-visual">
                {hero.heroStats.map((stat) => {
                  const Icon =
                    heroStatIconMap[stat.icon]
                    || heroStatLabelIconMap[stat.label]
                    || Activity;
                  const toneClass =
                    stat.label === 'Sample Collection' || stat.label === 'Home Collection'
                      ? 'tone-home'
                      : stat.label === 'Report Delivery'
                        ? 'tone-report'
                        : 'tone-tests';
                  return (
                    <article key={stat.label} className="hero-inline-stat">
                      <span className={`hero-inline-stat-icon ${toneClass}`.trim()} aria-hidden="true">
                        <Icon size={15} strokeWidth={2} />
                      </span>
                      <div className="hero-inline-stat-copy">
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Tests — Most Booked */}
      <ScrollReveal as="section" className="section section-popular-tests">
        <div className="popular-tests-glow" aria-hidden="true" />
        <div className="container popular-tests-inner">
          <header className="popular-tests-header">
            <div className="popular-tests-header-copy">
              <span className="popular-tests-eyebrow">MOST BOOKED</span>
              <h2 className="popular-tests-title">
                Popular <em>tests</em>, ready to book.
              </h2>
            </div>
            <div className="popular-tests-header-actions">
              <Link to="/tests" className="btn btn-primary">
                View all tests
                <ArrowUpRight size={15} strokeWidth={2.75} />
              </Link>
            </div>
          </header>

          <div
            className="popular-tests-carousel"
            onMouseEnter={() => setPopularPaused(true)}
            onMouseLeave={() => setPopularPaused(false)}
            onFocusCapture={() => setPopularPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setPopularPaused(false);
              }
            }}
          >
            <div className="popular-tests-track" ref={popularTrackRef}>
              {popularLoopSlides.map((slide, index) => (
                <div
                  key={slide.key}
                  className={`popular-tests-slide${index === popularLoopIdx ? ' is-active' : ''}`}
                  data-popular-loop={index}
                >
                  <TestCard
                    test={slide.test}
                    variant="carousel"
                    active={index === popularLoopIdx}
                    onActivate={() => focusPopularSlide(slide.realIndex)}
                  />
                </div>
              ))}
            </div>

            {popularCount > 1 && (
              <div className="popular-tests-nav" aria-label="Browse popular tests">
                <button
                  type="button"
                  className="popular-tests-arrow"
                  aria-label="Previous popular test"
                  onClick={() => stepPopularCarousel(-1)}
                >
                  <ArrowLeft size={16} strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  className="popular-tests-arrow is-next"
                  aria-label="Next popular test"
                  onClick={() => stepPopularCarousel(1)}
                >
                  <ArrowRight size={16} strokeWidth={2.25} />
                </button>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Service tiles — bento layout (content unchanged) */}
      <ScrollReveal as="section" className="section modern-service-tiles-section" delay={0.04}>
        <div className="services-bento-glow" aria-hidden="true" />
        <div className="container services-bento-inner">
          <header className="modern-tiles-header">
            <div className="modern-tiles-header-copy">
              <span className="modern-tiles-tagline">INTEGRATED DIAGNOSTICS</span>
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
              <div
                className="bento-card-media"
                style={{ backgroundImage: "url('/images/bento-blood-tests.png')" }}
                aria-hidden="true"
              />
              <div className="bento-card-veil bento-card-veil-dark" aria-hidden="true" />
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

            {/* Free Sample Collections */}
            <Link
              to={SERVICE_TILES[1].link}
              className="bento-card bento-packages"
            >
              <div
                className="bento-card-media"
                style={{ backgroundImage: "url('/images/bento-packages.png')" }}
                aria-hidden="true"
              />
              <div className="bento-card-veil bento-card-veil-teal" aria-hidden="true" />
              <div className="bento-card-top">
                <span className="bento-pill bento-pill-glass">{SERVICE_TILES[1].offer}</span>
                <HomeIcon size={22} strokeWidth={1.75} className="bento-corner-icon" />
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
              <div
                className="bento-card-media"
                style={{ backgroundImage: "url('/images/bento-concerns.png')" }}
                aria-hidden="true"
              />
              <div className="bento-card-veil bento-card-veil-navy" aria-hidden="true" />
              <Compass size={22} strokeWidth={1.75} className="bento-corner-icon" />
              <div className="bento-card-copy">
                <h3>{SERVICE_TILES[3].title}</h3>
                <p>{SERVICE_TILES[3].desc}</p>
              </div>
            </Link>

            {/* Quick Book */}
            <a
              href={whatsappUrl}
              className="bento-card bento-quick"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="bento-card-media"
                style={{ backgroundImage: "url('/images/bento-quick-book.png')" }}
                aria-hidden="true"
              />
              <div className="bento-card-veil bento-card-veil-sky" aria-hidden="true" />
              <Zap size={22} strokeWidth={1.75} className="bento-corner-icon" />
              <div className="bento-card-copy">
                <h3>{SERVICE_TILES[2].title}</h3>
                <p>{SERVICE_TILES[2].desc}</p>
              </div>
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Promo care banner */}
      <ScrollReveal as="section" className="section section-promo-banner" delay={0.05}>
        <div className="container">
          <div className="promo-banner">
            <div className="promo-banner-waves" aria-hidden="true">
              <svg className="promo-banner-wave promo-banner-wave-1" viewBox="0 0 800 400" preserveAspectRatio="none">
                <path
                  d="M0 280 C 160 200, 280 340, 420 250 C 560 160, 680 300, 800 220 L 800 400 L 0 400 Z"
                  fill="currentColor"
                />
              </svg>
              <svg className="promo-banner-wave promo-banner-wave-2" viewBox="0 0 800 400" preserveAspectRatio="none">
                <path
                  d="M0 320 C 180 240, 320 360, 480 280 C 620 200, 720 320, 800 260 L 800 400 L 0 400 Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="promo-banner-copy">
              <h2 className="promo-banner-title">energex.life</h2>
              <p className="promo-banner-desc">
                At energex.life, we are committed to providing exceptional diagnostic care with a focus on quality, trust, and innovation.
              </p>
              <a
                href={whatsappUrl}
                className="promo-banner-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Zap size={16} strokeWidth={2.4} fill="currentColor" />
                Book Test Now
              </a>
            </div>

            <div className="promo-banner-visual">
              <img
                src="/images/promo-doctor.png"
                alt="Doctor ready to guide your diagnostic booking"
                className="promo-banner-doctor"
                width={420}
                height={520}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Popular Packages — Full Body Checkups */}
      <ScrollReveal as="section" className="section section-packages">
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
      </ScrollReveal>

      {/* Browse by disease / concern */}
      <ScrollReveal as="section" className="section section-concerns" id="concerns">
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
            <nav className="concerns-tabs" aria-label="Browse by category">
              {CONCERN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`concerns-tab${concernTab === tab.id ? ' is-active' : ''}`}
                  onClick={() => setConcernTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="concerns-panel">
              {concernScroll.canScroll && (
                <div className="concerns-rail-nav" aria-label="Browse more concerns">
                  <div
                    className="concerns-rail-progress"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(concernScroll.progress)}
                    aria-label="Scroll progress"
                  >
                    <span
                      className="concerns-rail-progress-fill"
                      style={{ width: `${concernScroll.progress}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    className="concerns-rail-arrow"
                    aria-label="Previous concerns"
                    disabled={concernScroll.atStart}
                    onClick={() => scrollConcernsBy(-1)}
                  >
                    <ArrowLeft size={16} strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    className="concerns-rail-arrow is-next"
                    aria-label="Next concerns"
                    disabled={concernScroll.atEnd}
                    onClick={() => scrollConcernsBy(1)}
                  >
                    <ArrowRight size={16} strokeWidth={2.25} />
                  </button>
                </div>
              )}

              <div className="concerns-rail" ref={concernRailRef} role="list">
                {(CONCERN_TABS.find((tab) => tab.id === concernTab)?.slugs || [])
                  .map((slug) => diseases.find((disease) => disease.slug === slug))
                  .filter(Boolean)
                  .map((disease, index) => (
                    <div key={disease._id} role="listitem">
                      <DiseaseCard
                        disease={disease}
                        selected={
                          selectedConcern
                            ? selectedConcern === disease.slug
                            : index === 3
                        }
                        onHighlight={() => setSelectedConcern(disease.slug)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Trust section */}
      <ScrollReveal as="section" className="section section-trust">
        <div className="trust-glow" aria-hidden="true" />
        <div className="container trust-inner">
          <div className="trust-board">
            <div className="trust-aside">
              <header className="trust-header">
                <span className="trust-eyebrow">Why Choose energex.life</span>
                <h2 className="trust-title">
                  Why Thousands Trust <em>energex.life</em> Labs
                </h2>
                <p className="trust-lede">
                  Quality diagnostics, careful collection, and clear reports — built around your confidence at every step.
                </p>
                <a
                  href={whatsappUrl}
                  className="btn btn-primary btn-lg trust-cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Zap size={18} strokeWidth={2.4} fill="currentColor" />
                  Book a Test
                </a>
              </header>

              <div className="trust-features">
                {TRUST_FEATURES.map((feature) => {
                  const FeatureIcon = feature.Icon;
                  return (
                    <article key={feature.title} className="trust-feature">
                      <div className="trust-feature-icon" aria-hidden="true">
                        <FeatureIcon size={22} strokeWidth={2.25} />
                      </div>
                      <div className="trust-feature-body">
                        <h3>{feature.title}</h3>
                        <p>{feature.detail}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="trust-hero-media">
              <img
                src="/images/trust-hero-lab.png"
                alt="energex.life diagnostic laboratory"
                className="trust-hero-img"
                loading="lazy"
                decoding="async"
              />
              <div className="trust-hero-stats">
                {TRUST_STATS.map((stat) => {
                  const StatIcon = stat.Icon;
                  return (
                    <div key={stat.label} className="trust-hero-stat">
                      <span className="trust-stat-icon" aria-hidden="true">
                        <StatIcon size={18} strokeWidth={2.1} />
                      </span>
                      <div className="trust-stat-copy">
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* How it works — image-matched layout */}
      <section className="section section-how-it-works" ref={howWorksRef}>
        <div className="how-works-glow" aria-hidden="true" />
        <ScrollReveal className="container">
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
                {HOW_IT_WORKS_STEPS.map((step, index) => (
                  <img
                    key={step.title}
                    src={step.image}
                    alt={step.alt}
                    className={`how-visual-photo${index === activeHowStep ? ' is-active' : ''}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ))}
              </div>

              <div className="how-visual-callout" key={activeHowStep}>
                <span className="how-callout-pill">{HOW_IT_WORKS_STEPS[activeHowStep].title}</span>
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
        </ScrollReveal>
      </section>

      {/* CTA Banner */}
      <ScrollReveal as="section" className="section cta-banner">
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
                <a
                  href={whatsappUrl}
                  className="btn btn-primary btn-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Zap size={17} strokeWidth={2.4} fill="currentColor" />
                  Book Test Now
                </a>
                <a
                  href={whatsappUrl}
                  className="btn btn-secondary-light btn-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon size={18} variant="inverse" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="section section-home-faq" aria-labelledby="home-faq-title">
        <div className="container home-faq-inner">
          <header className="home-faq-header">
            <span className="home-faq-eyebrow">FAQs</span>
            <h2 id="home-faq-title" className="home-faq-title">
              Questions, <em>answered</em>
            </h2>
            <p className="home-faq-lede">
              Everything you need to know about booking, home collection, and reports.
            </p>
          </header>
          <FAQAccordion faqs={HOME_FAQS} />
        </div>
      </ScrollReveal>

      <FloatingCTA />
    </>
  );
}
