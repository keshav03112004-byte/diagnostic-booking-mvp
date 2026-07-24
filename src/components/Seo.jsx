import { useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';
import {
  absoluteUrl,
  buildPageTitle,
  defaultOgImage,
} from '../config/seo';

const META_ATTR = 'data-energex-seo';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"][${META_ATTR}]`);
  if (!el) {
    el = document.head.querySelector(`meta[${attr}="${key}"]`);
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(META_ATTR, 'true');
    document.head.appendChild(el);
  } else {
    el.setAttribute(META_ATTR, 'true');
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"][${META_ATTR}]`);
  if (!el) {
    el = document.head.querySelector(`link[rel="${rel}"]`);
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(META_ATTR, 'true');
    document.head.appendChild(el);
  } else {
    el.setAttribute(META_ATTR, 'true');
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  const scriptId = `energex-jsonld-${id}`;
  let el = document.getElementById(scriptId);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = scriptId;
    el.setAttribute(META_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Per-route SEO metadata for title, description, social previews, canonical URL, and JSON-LD.
 */
export default function Seo({
  title,
  description = siteConfig.seo.defaultDescription,
  path,
  image = defaultOgImage,
  keywords = siteConfig.seo.keywords,
  type = 'website',
  noindex = false,
  absoluteTitle = false,
  jsonLd,
  jsonLdId = 'page',
}) {
  useEffect(() => {
    const pageTitle = buildPageTitle(title, { absolute: absoluteTitle });
    const canonical = absoluteUrl(path || (typeof window !== 'undefined' ? window.location.pathname : '/'));
    const imageUrl = absoluteUrl(image);
    const robots = noindex ? 'noindex, nofollow' : 'index, follow';
    const structured = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

    document.title = pageTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'theme-color', '#08B090');
    upsertMeta('name', 'author', siteConfig.name);

    upsertMeta('property', 'og:site_name', siteConfig.name);
    upsertMeta('property', 'og:locale', 'en_IN');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', imageUrl);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
    if (siteConfig.seo.twitterHandle) {
      upsertMeta('name', 'twitter:site', siteConfig.seo.twitterHandle);
    }

    upsertLink('canonical', canonical);

    structured.forEach((entry, index) => upsertJsonLd(`${jsonLdId}-${index}`, entry));

    return () => {
      structured.forEach((_, index) => {
        document.getElementById(`energex-jsonld-${jsonLdId}-${index}`)?.remove();
      });
    };
  }, [
    title,
    description,
    path,
    image,
    keywords,
    type,
    noindex,
    absoluteTitle,
    jsonLd,
    jsonLdId,
  ]);

  return null;
}
