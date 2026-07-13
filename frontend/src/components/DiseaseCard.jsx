import { Link } from 'react-router-dom';

export default function DiseaseCard({ disease }) {
  return (
    <Link to={`/disease/${disease.slug}`} className="card disease-card">
      <span className="disease-icon">{disease.icon}</span>
      <h3>{disease.name}</h3>
      <p>{disease.description?.slice(0, 55)}...</p>
      <span className="disease-arrow">View tests →</span>
    </Link>
  );
}
