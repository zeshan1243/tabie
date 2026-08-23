export default function SkeletonCard() {
  return (
    <div className="content-card" aria-hidden="true">
      <div className="skeleton" style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 12 }} />
      <div className="skeleton" style={{ height: 11, width: '38%', marginTop: 9, borderRadius: 4 }} />
    </div>
  );
}
