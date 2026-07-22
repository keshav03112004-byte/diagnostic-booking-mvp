import { chromium } from 'playwright';
import fs from 'fs';

const URL =
  'https://booking.thyrocare.com/landing-page?oldLpUrl=UFJPSjEwNDY4NzAsUFJPSjEwNDc3MDEsUFJPSjEwNDcwMjgsUFJPSjEwNDcwMjksUFJPSjEwNDY4NzksUFJPSjEwNDY4NzgsUFJPSjEwNDY4NzcsUFJPSjEwNDY4NzYsUFJPSjEwNDk3MjksUFJPSjEwNDk3NTI=';

const catalogResponses = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('response', async (res) => {
  try {
    const u = res.url();
    if (u.includes('catalog') || u.includes('get-lp-details') || u.includes('products')) {
      const status = res.status();
      let body = null;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }
      catalogResponses.push({ url: u, status, body });
    }
  } catch {
    /* ignore */
  }
});

await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(5000);

// Scroll to load packages section
await page.evaluate(async () => {
  const el = document.getElementById('packagesForYou');
  if (el) el.scrollIntoView();
  window.scrollBy(0, 800);
});
await page.waitForTimeout(3000);

const text = await page.locator('body').innerText();
const html = await page.content();

const packages = await page.evaluate(() => {
  const results = [];
  const cards = Array.from(
    document.querySelectorAll(
      '[class*="Package"], [class*="package"], [id="packagesForYou"] *'
    )
  );

  // Prefer structured cards with price-like text
  const candidates = Array.from(document.querySelectorAll('div, article, section, li')).filter(
    (el) => {
      const t = el.innerText || '';
      return (
        t.length > 20 &&
        t.length < 800 &&
        /₹|Rs\.?/i.test(t) &&
        /\d+\s*tests?/i.test(t)
      );
    }
  );

  const seen = new Set();
  for (const el of candidates) {
    const t = el.innerText.replace(/\s+/g, ' ').trim();
    if (seen.has(t)) continue;
    // Prefer leaf-ish cards
    const childHasSame = Array.from(el.children).some((c) => {
      const ct = (c.innerText || '').replace(/\s+/g, ' ').trim();
      return ct === t;
    });
    if (childHasSame) continue;
    seen.add(t);
    results.push(t);
  }
  return results.slice(0, 40);
});

fs.writeFileSync(
  'thyrocare-scrape.json',
  JSON.stringify({ packages, catalogResponses, textSnippet: text.slice(0, 8000) }, null, 2)
);
console.log('packages found:', packages.length);
packages.forEach((p, i) => console.log(`\n--- ${i + 1} ---\n${p}`));
console.log('\ncatalog responses:', catalogResponses.length);
catalogResponses.forEach((r) => {
  console.log(r.status, r.url);
  const preview = typeof r.body === 'string' ? r.body.slice(0, 200) : JSON.stringify(r.body).slice(0, 400);
  console.log(preview);
});

await browser.close();
