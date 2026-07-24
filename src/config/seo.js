import { siteConfig } from './siteConfig';

const envSiteUrl = (import.meta.env.VITE_SITE_URL || import.meta.env.VITE_APP_URL || '').replace(/\/$/, '');

export function getSiteUrl() {
  if (envSiteUrl) return envSiteUrl;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://energex.life';
}

export function absoluteUrl(path = '/') {
  const base = getSiteUrl();
  if (!path || path === '/') return `${base}/`;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildPageTitle(title, { absolute = false } = {}) {
  if (!title) return siteConfig.seo.defaultTitle;
  if (absolute) return title;
  if (title.includes(siteConfig.name)) return title;
  return `${title} | ${siteConfig.name}`;
}

export const defaultOgImage = '/logo.png';

export const pageSeo = {
  home: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    path: '/',
    keywords: siteConfig.seo.keywords,
  },
  tests: {
    title: 'Book Lab Tests Online',
    description:
      'Browse and book certified blood tests and diagnostic lab tests at home with energex.life. Transparent pricing, free home collection, and smart reports.',
    path: '/tests',
    keywords: 'book lab tests online, blood tests at home, diagnostic tests India, energex life tests',
  },
  packages: {
    title: 'Health Checkup Packages',
    description:
      'Explore full body checkup and wellness packages from energex.life. Save on curated test bundles with free home sample collection.',
    path: '/packages',
    keywords: 'full body checkup, health packages, wellness packages, energex life packages',
  },
  contact: {
    title: 'Contact Us',
    description:
      'Contact energex.life for booking help, home collection queries, or package guidance. We are here to help you book diagnostics with confidence.',
    path: '/contact',
    keywords: 'contact energex life, diagnostic booking support, home collection help',
  },
  quickBook: {
    title: 'Quick Book',
    description: 'Start a quick diagnostic booking with energex.life on WhatsApp.',
    path: '/book/quick',
    noindex: true,
  },
  checkout: {
    title: 'Checkout',
    description: 'Complete your diagnostic booking with energex.life.',
    path: '/checkout',
    noindex: true,
  },
  myBookings: {
    title: 'My Bookings',
    description: 'View your energex.life diagnostic bookings.',
    path: '/my-bookings',
    noindex: true,
  },
  profile: {
    title: 'Profile',
    description: 'Manage your energex.life profile.',
    path: '/profile',
    noindex: true,
  },
  loginRedirect: {
    title: 'Book on WhatsApp',
    description: 'Continue your energex.life booking on WhatsApp.',
    path: '/login',
    noindex: true,
  },
  admin: {
    title: 'Admin',
    description: 'energex.life admin panel',
    noindex: true,
  },
};

export function truncateMeta(text = '', max = 158) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.seo.defaultDescription,
    logo: absoluteUrl('/logo.png'),
    image: absoluteUrl(defaultOgImage),
    medicalSpecialty: 'Diagnostic',
    areaServed: 'IN',
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: getSiteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getSiteUrl()}/tests?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd({ name, description, price, path, image, sku }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku: sku || undefined,
    image: image ? absoluteUrl(image) : absoluteUrl(defaultOgImage),
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(path),
      priceCurrency: 'INR',
      price: Number(price) || 0,
      availability: 'https://schema.org/InStock',
    },
  };
}
