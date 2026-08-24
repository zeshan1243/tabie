import { useCallback, useRef } from 'react';

// Touch-only: a mouse already gets the desktop hover reveal, so this only arms for
// pointerType === 'touch'. Cancels itself if the finger moves past `moveTolerance`
// before the delay elapses, so a scroll/drag gesture across a row never fires it. The
// click that follows a fired press is swallowed in capture phase so the card does not
// also navigate out from under the sheet it just opened.
export function useLongPress(onLongPress, { delay = 1000, moveTolerance = 10 } = {}) {
  const timer = useRef(null);
  const origin = useRef({ x: 0, y: 0 });
  const fired = useRef(false);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const onPointerDown = useCallback(
    (e) => {
      if (e.pointerType !== 'touch') return;
      fired.current = false;
      origin.current = { x: e.clientX, y: e.clientY };
      clear();
      timer.current = setTimeout(() => {
        fired.current = true;
        timer.current = null;
        onLongPress(e);
      }, delay);
    },
    [clear, delay, onLongPress]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!timer.current) return;
      const dx = e.clientX - origin.current.x;
      const dy = e.clientY - origin.current.y;
      if (Math.hypot(dx, dy) > moveTolerance) clear();
    },
    [clear, moveTolerance]
  );

  const onClickCapture = useCallback((e) => {
    if (!fired.current) return;
    fired.current = false;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp: clear, onPointerCancel: clear, onClickCapture };
}
