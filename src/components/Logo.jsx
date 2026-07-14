import './Logo.css';

export default function Logo({ className = '', height = 52 }) {
  return (
    <div
      className={`brand-logo ${className}`.trim()}
      style={{ '--logo-height': `${height}px` }}
    >
      <img
        src="/logo.png"
        alt="energex.life"
        className="brand-logo-image"
        height={height}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
