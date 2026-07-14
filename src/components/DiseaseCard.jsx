import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Droplet,
  Bone,
  Activity,
  Thermometer,
  Heart,
  FlaskConical,
  Pill,
  Baby,
  Leaf,
  Sparkles,
} from 'lucide-react';

const CONCERN_ICONS = {
  anaemia: Droplet,
  arthritis: Bone,
  diabetes: Activity,
  fever: Thermometer,
  heart: Heart,
  kidney: FlaskConical,
  liver: Pill,
  pregnancy: Baby,
  thyroid: Leaf,
  vitamins: Sparkles,
};

export default function DiseaseCard({ disease }) {
  const Icon = CONCERN_ICONS[disease.slug] || Sparkles;

  return (
    <Link to={`/disease/${disease.slug}`} className="premium-concern-card">
      <div className="icon-wrapper" aria-hidden="true">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div className="concern-card-footer">
        <h3 className="concern-title">{disease.name}</h3>
        <span className="arrow-wrapper">
          <ArrowUpRight size={16} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
