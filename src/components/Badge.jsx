import './Badge.css';

export default function Badge({ tone = 'default', children, className = '' }) {
  return <span className={`badge badge--${tone} ${className}`}>{children}</span>;
}
