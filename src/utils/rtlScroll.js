// Browsers disagree on what a fresh RTL scroll container's *native* scrollLeft actually
// means. Chrome/Firefox default to 0 already meaning "the start" (the first item, at the
// right edge) — but Safari's model defaults to 0 meaning "the end", so on mount the row
// visually opens already scrolled past its last item, and the user has to swipe toward
// the start to see the first one. This is exactly the deployed-build bug report: "the
// rail was at the end, I had to swipe right to fix it."
//
// Detected once (it depends only on the browser engine, not any particular element) using
// the classic hidden-test-div technique, then cached.
let cachedType = null;

function detectRtlScrollType() {
  if (typeof document === 'undefined') return 'negative';

  const outer = document.createElement('div');
  outer.dir = 'rtl';
  Object.assign(outer.style, {
    position: 'absolute',
    top: '-9999px',
    width: '50px',
    height: '50px',
    overflow: 'scroll',
  });

  const inner = document.createElement('div');
  Object.assign(inner.style, { width: '100px', height: '100px' });
  outer.appendChild(inner);
  document.body.appendChild(outer);

  let type;
  if (outer.scrollLeft > 0) {
    // Native rest already sits at the max — i.e. already correctly at the start.
    type = 'default';
  } else {
    outer.scrollLeft = 1;
    // Firefox/modern Chrome: only negative values move away from the (already-correct)
    // start, so setting +1 is out of range and snaps back to 0. Safari: +1 holds, and
    // native rest (0) was the *wrong* end — the "reverse" case this fix targets.
    type = outer.scrollLeft === 0 ? 'negative' : 'reverse';
  }

  document.body.removeChild(outer);
  return type;
}

function getRtlScrollType() {
  if (cachedType === null) cachedType = detectRtlScrollType();
  return cachedType;
}

// The scrollLeft value that shows the true start of an RTL scroll container's content
// (its first child, at the right edge) on whichever of the three browser models is
// running — 'default' and 'reverse' both need the max value; only 'negative' needs 0.
export function rtlStartScrollLeft(el) {
  return getRtlScrollType() === 'negative' ? 0 : el.scrollWidth - el.clientWidth;
}
