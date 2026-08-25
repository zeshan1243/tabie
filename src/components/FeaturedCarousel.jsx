import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { genreLabel } from '../data/genres';
import { rtlStartScrollLeft } from '../utils/rtlScroll';
import FeaturedCard from './FeaturedCard';
import { ChevronStart, ChevronEnd, PlayIcon, InfoIcon } from './icons';
import './FeaturedCarousel.css';

export default function FeaturedCarousel({ title, items, seeAllHref }) {
  const { t, lang, isRtl } = useI18n();
  const trackRef = useRef(null);
  const drag = useRef({ moved: false });
  // Holds the in-flight gesture's listener cleanup, so unmounting mid-drag cannot leak it.
  const teardown = useRef(null);

  useEffect(() => () => teardown.current?.(), []);

  // Some browsers' native "rest" scrollLeft for a fresh RTL container lands on the wrong
  // end (see utils/rtlScroll) — without this the row opens already scrolled past its last
  // card. Layout effect so it lands before the row ever paints scrolled.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || !isRtl) return;
    el.scrollLeft = rtlStartScrollLeft(el);
  }, [isRtl, items.length]);

  // Mouse drag-to-scroll, same as ContentRail.jsx — this row otherwise had no way to
  // scroll by dragging with a mouse, only via the nav buttons, unlike every other rail.
  // See ContentRail.jsx for why the listeners live on window rather than the track.
  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el || e.pointerType === 'touch' || e.button !== 0) return;

    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    drag.current.moved = false;

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      if (!drag.current.moved) {
        if (Math.abs(dx) < 6) return;
        drag.current.moved = true;
        el.style.scrollSnapType = 'none';
      }
      el.scrollLeft = startScroll - dx;
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      teardown.current = null;
      el.style.scrollSnapType = '';
    };

    teardown.current = onUp;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // Swallows the click that would otherwise end a drag by navigating the card underneath.
  const onClickCapture = (e) => {
    if (!drag.current.moved) return;
    e.preventDefault();
    e.stopPropagation();
  };

  // Keeps the expanding card fully in view when it grows near either edge of the
  // scroll container — called once immediately and again mid-transition so the
  // scroll keeps pace as the card widens, without any abrupt jump.
  const keepVisible = useCallback((event) => {
    const card = event.currentTarget;
    const nudge = () => card.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    nudge();
    setTimeout(nudge, 240);
  }, []);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7 * dir * (isRtl ? -1 : 1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section className="featured-carousel">
      <div className="featured-carousel__header container">
        <h2 className="featured-carousel__title">{title}</h2>
        {seeAllHref && (
          <Link to={seeAllHref} className="featured-carousel__see-all">
            {t('common.seeAll')}
          </Link>
        )}
      </div>

      <div className="featured-carousel__viewport">
        <button type="button" className="featured-carousel__nav featured-carousel__nav--prev" onClick={() => scrollBy(-1)} aria-label={t('common.back')}>
          <ChevronStart />
        </button>

        <div
          className="featured-carousel__track hide-scrollbar container scroll-track"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onClickCapture={onClickCapture}
        >
          {items.map((item) => {
            const metaParts = [
              item.year,
              item.seasons ? `${item.seasons} ${item.seasons === 1 ? t('details.season') : t('common.seasons')}` : item.duration ? `${item.duration} ${t('common.minutes')}` : null,
              item.genres.slice(0, 2).map((g) => genreLabel(g, lang)).join(' · '),
            ].filter(Boolean);

            return (
              <FeaturedCard
                key={item.id}
                detailsHref={`/title/${item.id}`}
                image={item.poster}
                title={item.title[lang]}
                description={item.synopsis[lang]}
                metadata={metaParts.join(' • ')}
                rating={item.rating}
                badge={item.tags?.includes('newRelease') ? t('common.new') : null}
                onMouseEnter={keepVisible}
                onFocus={keepVisible}
                actions={[
                  { key: 'play', to: `/watch/${item.id}`, icon: <PlayIcon width={15} height={15} />, label: t('common.watchNow'), variant: 'primary' },
                  { key: 'info', to: `/title/${item.id}`, icon: <InfoIcon width={16} height={16} />, label: t('common.moreInfo') },
                ]}
              />
            );
          })}
        </div>

        <button type="button" className="featured-carousel__nav featured-carousel__nav--next" onClick={() => scrollBy(1)} aria-label={t('common.seeAll')}>
          <ChevronEnd />
        </button>
      </div>
    </section>
  );
}
