import './ProgressBar.css';

export default function ProgressBar({ value = 0, size = 'md' }) {
  return (
    <div className={`progress progress--${size}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress__fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
