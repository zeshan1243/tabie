export default function SkeletonCard({ orientation = 'portrait' }) {
  return (
    <div className={`content-card content-card--${orientation}`} aria-hidden="true">
      <div className="skeleton" style={{ width: '100%', aspectRatio: orientation === 'landscape' ? '16 / 9' : '2 / 3' }} />
      <div className="skeleton" style={{ height: 12, width: '70%', marginTop: 10, borderRadius: 4 }} />
    </div>
  );
}
