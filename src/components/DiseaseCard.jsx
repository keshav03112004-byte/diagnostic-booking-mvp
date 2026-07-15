import { Link } from 'react-router-dom';
import {
  Bone,
  Activity,
  Thermometer,
  Heart,
  Pill,
  Baby,
  Droplet,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

/** Simple organ silhouettes for body-part concerns (lucide has no kidney/liver/thyroid). */
function KidneyIcon({ size = 28, strokeWidth = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 3.5c-2.4 0-4 1.7-4.5 3.6-.4-1.5-1.7-2.6-3.5-2.6C4.2 4.5 2.5 6.6 2.5 9.8c0 4.4 2.8 8.7 5.8 10.2 1.2.6 2.4.2 3-.7.3-.5.7-.8 1.2-.8s.9.3 1.2.8c.6.9 1.8 1.3 3 .7 3-1.5 5.8-5.8 5.8-10.2 0-3.2-1.7-5.3-4-5.3-1.2 0-2.3.6-3 1.5-.5-.8-1.2-1.5-2-.15Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M12 9.2v5.2M10.2 11.8h3.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function LiverIcon({ size = 28, strokeWidth = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 9.5c0-2.8 2-5 5.2-5h3.1c.9 0 1.7.3 2.4.8 1.4 1 3.3 1.2 5 .5.7-.3 1.3.3 1.3 1.1v2.4c0 4.8-3.2 8.9-8.2 9.7-3.6.6-6.8-1.4-8-4.4C4.8 13.8 4.5 12.4 4.5 11v-1.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M11.2 6.2c.2 2.2-.4 4.1-1.8 5.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThyroidIcon({ size = 28, strokeWidth = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.2 6.5c-2.2.4-3.7 2.4-3.7 5.1 0 3.4 2.1 6.2 4.5 6.2 1.1 0 1.8-.6 2.2-1.4.3.7.9 1.2 1.8 1.2 1 0 1.7-.6 2.1-1.4.4.8 1.1 1.4 2.2 1.4 2.4 0 4.5-2.8 4.5-6.2 0-2.7-1.5-4.7-3.7-5.1-1.3-.2-2.4.3-3.2 1.2-.7-.8-1.7-1.3-2.9-1.3s-2.2.5-2.9 1.3c-.8-.8-1.8-1.3-3.1-1.1Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M12 9.5v5.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

const CONCERN_VISUALS = [
  { match: ['heart', 'cardiac', 'cardio', 'cholesterol', 'lipid'], Icon: Heart, tone: 'rose' },
  { match: ['kidney', 'renal'], Icon: KidneyIcon, tone: 'cyan' },
  { match: ['liver', 'hepatic'], Icon: LiverIcon, tone: 'mint' },
  { match: ['thyroid'], Icon: ThyroidIcon, tone: 'amber' },
  { match: ['vitamin', 'vitamins', 'nutrient'], Icon: Pill, tone: 'lime' },
  { match: ['pregnan', 'maternity', 'prenatal', 'fertility'], Icon: Baby, tone: 'pink' },
  { match: ['anaemia', 'anemia', 'hemoglobin', 'blood'], Icon: Droplet, tone: 'sky' },
  { match: ['arthritis', 'joint', 'bone', 'ortho'], Icon: Bone, tone: 'slate' },
  { match: ['diabetes', 'sugar', 'glucose', 'insulin'], Icon: Activity, tone: 'teal' },
  { match: ['fever', 'infection', 'viral', 'flu'], Icon: Thermometer, tone: 'rose' },
  { match: ['lung', 'respiratory', 'breath'], Icon: Stethoscope, tone: 'navy' },
  { match: ['checkup', 'general', 'basic', 'wellness'], Icon: Stethoscope, tone: 'teal' },
];

function resolveConcernVisual(disease) {
  const haystack = `${disease?.slug || ''} ${disease?.name || ''}`.toLowerCase();

  for (const entry of CONCERN_VISUALS) {
    if (entry.match.some((token) => haystack.includes(token))) {
      return { Icon: entry.Icon, tone: entry.tone, emoji: null };
    }
  }

  if (disease?.icon) {
    return { Icon: null, tone: 'teal', emoji: disease.icon };
  }

  return { Icon: Sparkles, tone: 'teal', emoji: null };
}

export default function DiseaseCard({ disease, selected = false, onHighlight }) {
  const { Icon, tone, emoji } = resolveConcernVisual(disease);
  const label = disease.name || 'Concern';

  return (
    <Link
      to={`/disease/${disease.slug}`}
      className={`concern-rail-card${selected ? ' is-selected' : ''}`}
      onMouseEnter={onHighlight}
      onFocus={onHighlight}
      aria-label={label}
    >
      <span className={`concern-rail-icon tone-${tone}`} aria-hidden="true">
        {emoji ? (
          <span className="concern-rail-emoji">{emoji}</span>
        ) : (
          <Icon size={28} strokeWidth={1.7} />
        )}
      </span>
      <h3 className="concern-rail-title">{label}</h3>
    </Link>
  );
}
