import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { rtlStartScrollLeft } from '../utils/rtlScroll';
import ContentCard from './ContentCard';
import SkeletonCard from './SkeletonCard';
import { ChevronStart, ChevronEnd } from './icons';
import './ContentRail.css';

// variant="portrait": on mobile only, cards switch to a 2/3 poster (like the search
// grid) instead of the 16/9 backdrop — denser and closer to how Disney+/Netflix/Prime
// browse rails actually look on a phone. Kept landscape for rows where a progressMap is
// passed (Continue Watching): a paused *scene* with a progress bar reads better than a
// poster there. Desktop is unaffected either way.
// ranked: shows a big outlined numeral behind each card, tucked under its start edge —
// the "Top 10"/"Top Videos" treatment. Position is derived from the item's own index in
// `items`, so it always matches what seeAllHref would show as #1, #2, #3…
export default function ContentRail({ title, items = [], seeAllHref, loading = false, progressMap, variant = 'landscape', ranked = false }) {
  const { t, isRtl } = useI18n();
  const trackRef = useRef(null);
  const drag = useRef({ moved: false });
  // Holds the in-flight gesture's listener cleanup, so unmounting mid-drag cannot leak it.
  const teardown = useRef(null);

  useEffect(() => () => teardown.current?.(), []);

  // Some browsers' native "rest" scrollLeft for a fresh RTL container lands on the wrong
  // end (see utils/rtlScroll) — without this the row opens already scrolled past its last
  // card. Re-applied whenever the item count changes, since that's what the track's
  // scrollWidth depends on. Layout effect so it lands before the row ever paints scrolled.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || !isRtl) return;
    el.scrollLeft = rtlStartScrollLeft(el);
  }, [isRtl, items.length]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * dir * (isRtl ? -1 : 1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Drag-to-scroll for pointer devices. Touch is left alone — the browser's own momentum
  // scrolling beats anything reimplemented here.
  //
  // The move/up listeners go on `window` for the life of the gesture rather than on the
  // track. Two earlier attempts failed for instructive reasons: listening on the track
  // dropped most moves once the cursor was over a card, and fixing that with
  // setPointerCapture retargeted the closing `click` to the track — which silently made
  // every card in the row unclickable. Window listeners need neither.
  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el || e.pointerType === 'touch' || e.button !== 0) return;

    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    drag.current.moved = false;

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      if (!drag.current.moved) {
        // A few pixels of slop, so a click with a slightly unsteady hand still opens the card.
        if (Math.abs(dx) < 6) return;
        drag.current.moved = true;
        // Snapping has to come off for the duration: it re-snaps on every write to
        // scrollLeft, so mid-drag positions inside the nearest snap zone were pulled
        // straight back and a short drag simply undid itself.
        el.style.scrollSnapType = 'none';
      }
      el.scrollLeft = startScroll - dx;
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      teardown.current = null;
      // Restored so the row settles onto the nearest card once the drag is over.
      el.style.scrollSnapType = '';
    };

    teardown.current = onUp;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // Every card is a link, so the click ending a drag would navigate. Swallowing it in the
  // capture phase stops it before React dispatches to the card's own handler. `moved` only
  // needs clearing on the next pointerdown, which resets it.
  const onClickCapture = (e) => {
    if (!drag.current.moved) return;
    e.preventDefault();
    e.stopPropagation();
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className={`rail${variant === 'portrait' ? ' rail--portrait' : ''}`}>
      <div className="rail__header container">
        <h2 className="rail__title">{title}</h2>
        {seeAllHref && (
          <Link to={seeAllHref} className="rail__see-all">
            {t('common.seeAll')}
          </Link>
        )}
      </div>
      <div className="rail__viewport">
        <button type="button" className="rail__nav rail__nav--prev" onClick={() => scrollBy(-1)} aria-label={t('common.back')}>
          <ChevronStart />
        </button>
        <div
          className="rail__track hide-scrollbar container scroll-track"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onClickCapture={onClickCapture}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item, i) =>
                ranked ? (
                  <div key={item.id} className="rail__ranked-item">
                    <span className="rail__rank" aria-hidden="true">
                      {i + 1}
                    </span>
                    <ContentCard item={item} captionInside={variant === 'portrait'} />
                  </div>
                ) : (
                  <ContentCard
                    key={item.id}
                    item={item}
                    progress={progressMap ? progressMap[item.id] : undefined}
                    captionInside={variant === 'portrait'}
                  />
                )
              )}
        </div>
        <button type="button" className="rail__nav rail__nav--next" onClick={() => scrollBy(1)} aria-label={t('common.seeAll')}>
          <ChevronEnd />
        </button>
      </div>
    </section>
  );
}
