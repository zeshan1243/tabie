import logoWhite from '../assets/logos/tabie-logo-white-transparent.png';
import logoNavy from '../assets/logos/tabie-logo-navy-transparent.png';
import './Logo.css';

// Real Tabie brand mark (from src/assets/logos) — the Arabic تابع ligature with the
// integrated play triangle is the brand's only logo (no separate Latin wordmark per
// the brand guidelines), so it's shown as-is regardless of the app's active language.
export default function Logo({ size = 'md', tone = 'white', className = '' }) {
  const src = tone === 'navy' ? logoNavy : logoWhite;
  return (
    <span className={`logo logo--${size} ${className}`}>
      <img src={src} alt="Tabie" className="logo__mark" />
    </span>
  );
}
