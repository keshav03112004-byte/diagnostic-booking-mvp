import fs from 'fs';

const pkgs = JSON.parse(fs.readFileSync('thyrocare-lp-packages.json', 'utf8'));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function titleCaseGroup(g) {
  return String(g || 'Other')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function genderFromName(name) {
  const n = name.toLowerCase();
  if (/\bfemale\b/.test(n)) return 'Female';
  if (/\bmale\b/.test(n)) return 'Male';
  return 'Male & Female';
}

function prettyName(name) {
  return name
    .split(' ')
    .map((w) => {
      if (/^\d/.test(w)) return w;
      if (w.toUpperCase() === 'XL') return 'XL';
      if (w.toUpperCase() === 'UTSH') return 'UTSH';
      return w.charAt(0) + w.slice(1).toLowerCase();
    })
    .join(' ')
    .replace(/\bOne Plus One\b/gi, '1+1');
}

function diseaseCategories(name, groups) {
  const text = `${name} ${groups.join(' ')}`.toLowerCase();
  const cats = [];
  if (/diabet|glucose|hba1c|sugar/.test(text)) cats.push('diabetes');
  if (/thyroid|tsh|t3|t4/.test(text)) cats.push('thyroid');
  if (/lipid|heart|cardiac|cholesterol/.test(text)) cats.push('heart');
  if (/liver|sgpt|sgot|bilirubin/.test(text)) cats.push('liver');
  if (/kidney|renal|creatinine|urea/.test(text)) cats.push('kidney');
  if (/vitamin/.test(text)) cats.push('vitamins');
  if (/iron|anemia|anaemia|hemogram|cbc/.test(text)) cats.push('anaemia');
  if (/arthritis|rheumatoid|accp/.test(text)) cats.push('arthritis');
  if (/allergy|intolerance|food/.test(text)) cats.push('fever');
  return [...new Set(cats)].slice(0, 4);
}

function buildTestCategories(testsIncluded) {
  const map = new Map();
  for (const t of testsIncluded || []) {
    const group = titleCaseGroup(t.groupName || 'General');
    if (!map.has(group)) map.set(group, []);
    map.get(group).push(t.name);
  }
  return [...map.entries()].map(([name, tests]) => ({ name, tests }));
}

const popularIds = new Set([
  'PROJ1046870',
  'PROJ1047701',
  'PROJ1060098',
  'PROJ1049729',
  'PROJ1063287',
]);

const out = pkgs.map((p) => {
  const selling = Number(p.rate?.sellingPrice || 0);
  const listing = Number(p.rate?.listingPrice || selling);
  const testCategories = buildTestCategories(p.testsIncluded);
  const groups = testCategories.map((c) => c.name);
  const includedTestNames = (p.testsIncluded || []).map((t) => t.name);
  const count = p.noOfTestsIncluded || includedTestNames.length;
  const name = prettyName(p.name);
  const gender = genderFromName(p.name);

  return {
    name,
    slug: slugify(p.name),
    thyrocareId: p.id,
    price: selling,
    originalPrice: listing > selling ? listing : Math.round(selling * 1.35),
    description: `Comprehensive preventive health package with ${count} tests. Book via WhatsApp for free home sample collection.`,
    overview: `${name} includes ${count} carefully selected parameters covering key body systems. Ideal for preventive screening with reports from accredited partner labs.`,
    gender,
    fastingRequired: true,
    fastingHours: 10,
    reportTatHours: 24,
    recommendedFor:
      gender === 'Male & Female'
        ? 'Adults for routine preventive checkup'
        : `${gender} preventive screening`,
    diseaseCategories: diseaseCategories(p.name, groups),
    isPopular: popularIds.has(p.id),
    totalTestsCount: count,
    includedTestNames,
    testSlugs: [],
    benefits: [
      'Free home sample collection',
      `${count} tests in one package`,
      'NABL-aligned partner laboratory reporting',
      'WhatsApp booking & support',
    ],
    highlights: groups.slice(0, 6).map((g) => `${g} covered`),
    preparation:
      'Fast for 8–10 hours before sample collection (water allowed). Avoid alcohol the night before. Continue regular medicines unless your doctor advises otherwise.',
    testCategories,
    faqs: [
      {
        question: `What is included in ${name}?`,
        answer: `This package includes ${count} tests across panels such as ${groups.slice(0, 4).join(', ')}.`,
      },
      {
        question: 'How do I book this package?',
        answer:
          'Tap Book Now to chat on WhatsApp. Our team will confirm your slot and arrange free home collection.',
      },
      {
        question: 'When will I get my report?',
        answer:
          'Most reports are available within 24 hours after sample collection, depending on the tests included.',
      },
    ],
  };
});

const file = `/** Auto-generated from Thyrocare landing-page catalog (${out.length} packages). */
module.exports = ${JSON.stringify(out, null, 2)};
`;

fs.writeFileSync('backend/src/data/thyrocarePackages.js', file);
console.log('Wrote', out.length, 'packages');
out.forEach((p) => console.log(`- ${p.name} | ${p.totalTestsCount} tests | ₹${p.price}`));
