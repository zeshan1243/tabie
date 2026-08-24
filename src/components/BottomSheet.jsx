import { useEffect } from 'react';
import './BottomSheet.css';

export default function BottomSheet({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    // The rail behind the sheet can still scroll under a touch drag otherwise, which
    // fights the sheet's own drag-to-dismiss-feeling swipe.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <span className="bottom-sheet__handle" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
