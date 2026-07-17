/** Keyword → emoji. First match wins (order matters for overlapping terms). */
const ICON_RULES = [
  { match: ['heart', 'cardiac', 'cardio', 'cholesterol', 'lipid'], icon: '❤️' },
  { match: ['kidney', 'renal'], icon: '🫘' },
  { match: ['liver', 'hepatic'], icon: '🫀' },
  { match: ['thyroid'], icon: '🦋' },
  { match: ['vitamin', 'vitamins', 'nutrient'], icon: '💊' },
  { match: ['pregnan', 'maternity', 'prenatal', 'fertility'], icon: '🤰' },
  { match: ['anaemia', 'anemia', 'hemoglobin', 'haemoglobin'], icon: '🔴' },
  { match: ['arthritis', 'joint', 'bone', 'ortho'], icon: '🦴' },
  { match: ['diabetes', 'sugar', 'glucose', 'insulin'], icon: '🩸' },
  { match: ['fever', 'infection', 'viral', 'flu', 'dengue', 'malaria', 'typhoid'], icon: '🌡️' },
  { match: ['lung', 'respiratory', 'breath', 'asthma'], icon: '🫁' },
  { match: ['blood', 'cbc', 'haemato', 'hemato'], icon: '🩸' },
  { match: ['checkup', 'general', 'basic', 'wellness', 'full body'], icon: '🩺' },
];

const DEFAULT_ICON = '🩺';

function resolveDiseaseIcon(name = '', slug = '') {
  const haystack = `${slug} ${name}`.toLowerCase().trim();
  if (!haystack) return DEFAULT_ICON;

  for (const rule of ICON_RULES) {
    if (rule.match.some((token) => haystack.includes(token))) {
      return rule.icon;
    }
  }

  return DEFAULT_ICON;
}

module.exports = { resolveDiseaseIcon, DEFAULT_ICON };
