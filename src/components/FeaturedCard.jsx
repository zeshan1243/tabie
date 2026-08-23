import { Link } from 'react-router-dom';
import './FeaturedCard.css';

export default function FeaturedCard({
  detailsHref,
  image,
  title,
  logo,
  description,
  metadata,
  badge,
  rating,
  actions = [],
  onMouseEnter,
  onFocus,
}) {
  return (
    <div className="featured-card" onMouseEnter={onMouseEnter} onFocus={onFocus}>
      <Link to={detailsHref} className="featured-card__media" aria-label={title}>
        <img src={image} alt="" loading="lazy" />
        <div className="featured-card__overlay" />
      </Link>

      <div className="featured-card__content">
        {logo ? <img src={logo} alt={title} className="featured-card__logo" /> : <p className="featured-card__title">{title}</p>}

        <div className="featured-card__meta-row">
          {rating && <span className="featured-card__pill featured-card__pill--outline">{rating}</span>}
          {metadata && <span className="featured-card__metadata">{metadata}</span>}
          {badge && <span className="featured-card__pill featured-card__pill--gold">{badge}</span>}
        </div>

        {description && <p className="featured-card__description line-clamp-2">{description}</p>}

        {actions.length > 0 && (
          <div className="featured-card__actions">
            {actions.map((action) => (
              <Link
                key={action.key}
                to={action.to}
                className={`featured-card__action ${action.variant === 'primary' ? 'is-primary' : ''}`}
                aria-label={action.label}
              >
                {action.icon}
                {action.variant === 'primary' && <span>{action.label}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
