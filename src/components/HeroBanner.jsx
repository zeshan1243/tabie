import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { genreLabel } from '../data/genres';
import { PlayIcon, InfoIcon, CalendarIcon, HeartIcon, CheckIcon, StarIcon } from './icons';
import './HeroBanner.css';

const ROTATE_MS = 7500;
const SWIPE_THRESHOLD = 40;
const MOBILE_STEP_VW = 78; // distance (in vw) between two peek-card centers

export default function HeroBanner({ items }) {
  const { t, lang } = useI18n();
  const { isInList, toggleList } = useAppState();
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);
  const item = items[index];
  // Holds the in-flight mouse-drag gesture's own listener cleanup (see onPointerDown).
  const teardown = useRef(null);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  useEffect(() => () => teardown.current?.(), []);

  const goTo = useCallback((i) => setIndex(i), []);

  const step = useCallback(
    (dx) => {
      if (Math.abs(dx) < SWIPE_THRESHOLD || items.length < 2) return;
      // Moving left reveals the next slide, moving right the previous one — the same
      // visual convention regardless of writing direction.
      setIndex((i) => (dx < 0 ? (i + 1) % items.length : (i - 1 + items.length) % items.length));
    },
    [items.length]
  );

  // Swipe-to-change-slide on touch. A short tap (no real horizontal movement) falls
  // through to whatever button/link is underneath — only a real swipe past the
  // threshold changes the slide, so this never steals a tap on the actions below.
  const swipe = useRef({ startX: 0 });
  const onTouchStart = (e) => {
    swipe.current.startX = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    step(e.changedTouches[0].clientX - swipe.current.startX);
  };

  // Same gesture for a mouse, on desktop — dragging the card left/right changes slides
  // too, not just clicking the dots. Pattern mirrors ContentRail's own drag-to-scroll:
  // listeners live on window for the gesture's life, and the closing click is swallowed
  // so a drag that ends over a button doesn't also fire it.
  const drag = useRef({ moved: false });
  const onPointerDown = (e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const startX = e.clientX;
    drag.current.moved = false;

    const onMove = (ev) => {
      if (Math.abs(ev.clientX - startX) < 6) return;
      drag.current.moved = true;
    };
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      teardown.current = null;
      if (drag.current.moved) step(ev.clientX - startX);
    };
    const onCancel = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      teardown.current = null;
    };

    teardown.current = onCancel;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
  };

  const onClickCapture = (e) => {
    if (!drag.current.moved) return;
    drag.current.moved = false;
    e.preventDefault();
    e.stopPropagation();
  };

  // --- mobile peek-carousel: a live "follows your finger" drag (unlike the desktop
  // card's release-only swipe above), so the track visibly tracks the touch/pointer
  // before snapping to the nearest slide. `moved` lives in a ref (not state) so the
  // click-swallow guard below reads a value that's current at click time — a state
  // flag flipped in the same pointerup handler isn't guaranteed to have committed
  // before the browser's own synthetic click fires right after.
  const [mobileDrag, setMobileDrag] = useState({ active: false, dx: 0 });
  const mobileStartX = useRef(0);
  const mobileMoved = useRef(false);

  const mobileDragStart = (clientX) => {
    mobileStartX.current = clientX;
    mobileMoved.current = false;
    setMobileDrag({ active: true, dx: 0 });
  };
  const mobileDragMove = (clientX) => {
    const dx = clientX - mobileStartX.current;
    if (Math.abs(dx) >= 6) mobileMoved.current = true;
    setMobileDrag((prev) => (prev.active ? { active: true, dx } : prev));
  };
  const mobileDragEnd = (clientX) => {
    const dx = clientX - mobileStartX.current;
    setMobileDrag({ active: false, dx: 0 });
    step(dx);
  };

  const onMobileTouchStart = (e) => mobileDragStart(e.touches[0].clientX);
  const onMobileTouchMove = (e) => mobileDragMove(e.touches[0].clientX);
  const onMobileTouchEnd = (e) => mobileDragEnd(e.changedTouches[0].clientX);

  // A card's click is only ever swallowed right after a real drag — reset on the
  // next pointerdown so a plain tap still opens the details page normally.
  const onMobileCardClickCapture = (e) => {
    if (!mobileMoved.current) return;
    mobileMoved.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  // Mouse-drag parity with the desktop card, for anyone testing the mobile layout
  // with a mouse (resized browser, devtools device mode, etc).
  const mobileTeardown = useRef(null);
  const onMobilePointerDown = (e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    mobileDragStart(e.clientX);

    const onMove = (ev) => mobileDragMove(ev.clientX);
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      mobileTeardown.current = null;
      mobileDragEnd(ev.clientX);
    };
    const onCancel = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      mobileTeardown.current = null;
      setMobileDrag({ active: false, dx: 0 });
    };

    mobileTeardown.current = onCancel;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
  };

  useEffect(() => () => mobileTeardown.current?.(), []);

  if (!item) return null;

  const saved = isInList(item.id);

  if (isMobile) {
    const metaLine = [
      item.year,
      genreLabel(item.genres[0], lang),
      item.rating,
      item.seasons ? `${item.seasons} ${t('common.seasons')}` : item.duration ? `${item.duration} ${t('common.minutes')}` : null,
    ]
      .filter(Boolean)
      .join('  •  ');

    return (
      <section className="hero hero-m" aria-label={item.title[lang]}>
        {items.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-m__ambient ${i === index ? 'is-active' : ''}`}
            style={{ backgroundImage: `url("${slide.backdrop}")` }}
          />
        ))}
        <div className="hero-m__ambient-scrim" />

        <div
          className="hero-m__track"
          onTouchStart={onMobileTouchStart}
          onTouchMove={onMobileTouchMove}
          onTouchEnd={onMobileTouchEnd}
          onPointerDown={onMobilePointerDown}
        >
          {items.map((slide, i) => {
            const offset = i - index;
            const active = offset === 0;
            // translateX is a physical transform — unlike a logical property, it does
            // not auto-mirror under dir="rtl", so the offset sign is flipped here:
            // "next" moves toward the left, matching every other RTL-swipeable row in
            // this app (see ContentRail's own RTL handling).
            const rtlOffset = -offset * MOBILE_STEP_VW;
            return (
              <Link
                key={slide.id}
                to={`/title/${slide.id}`}
                className="hero-m__card"
                draggable="false"
                onClickCapture={onMobileCardClickCapture}
                style={{
                  transform: `translateX(calc(-50% + ${rtlOffset}vw${mobileDrag.active ? ` + ${mobileDrag.dx}px` : ''})) scale(${active ? 1 : 0.86})`,
                  transition: mobileDrag.active ? 'none' : undefined,
                  zIndex: active ? 2 : 1,
                }}
              >
                <img src={slide.backdrop} alt="" className="hero-m__card-img" draggable="false" />
                <span className={`hero-m__card-dim ${active ? '' : 'is-dim'}`} />
              </Link>
            );
          })}
        </div>

        <div className="hero-m__content" key={item.id}>
          <p className="hero-m__eyebrow">
            <StarIcon width={12} height={12} />
            {t('home.heroEyebrow')}
          </p>
          <h1 className="hero-m__title line-clamp-1">{item.title[lang]}</h1>
          <p className="hero-m__meta">{metaLine}</p>
          <p className="hero-m__synopsis line-clamp-1">{item.synopsis[lang]}</p>

          <div className="hero-m__actions">
            <Link to={`/watch/${item.id}`} className="hero-m__watch-btn">
              <PlayIcon width={16} height={16} />
              {t('common.watchNow')}
            </Link>
            <button
              type="button"
              className={`hero__icon-btn hero-m__icon-btn ${saved ? 'is-active' : ''}`}
              onClick={() => toggleList(item.id)}
              aria-pressed={saved}
              aria-label={saved ? t('common.removeFromList') : t('common.addToList')}
            >
              {saved ? <CheckIcon width={16} height={16} /> : <HeartIcon width={16} height={16} />}
            </button>
            <Link to={`/title/${item.id}`} className="hero__icon-btn hero-m__icon-btn" aria-label={t('common.moreInfo')}>
              <InfoIcon width={16} height={16} />
            </Link>
          </div>

          {items.length > 1 && (
            <div className="hero__dots hero-m__dots">
              {items.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`hero__dot ${i === index ? 'is-active' : ''}`}
                  aria-label={slide.title[lang]}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="hero" aria-label={item.title[lang]}>
      <div
        className="hero__card"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        {items.map((slide, i) => (
          <div key={slide.id} className={`hero__bg ${i === index ? 'is-active' : ''}`} style={{ backgroundImage: `url("${slide.backdrop}")` }} />
        ))}
        <div className="hero__scrim" />
        <div className="hero__content container">
          <p className="hero__eyebrow">
            <StarIcon width={13} height={13} />
            {t('home.heroEyebrow')}
          </p>
          <h1 className="hero__title">{item.title[lang]}</h1>
          <p className="hero__date">
            <CalendarIcon width={15} height={15} />
            {item.year}
          </p>
          <p className="hero__synopsis line-clamp-2">{item.synopsis[lang]}</p>
          <div className="hero__tags">
            {item.genres.slice(0, 4).map((g) => (
              <span key={g} className="hero__tag">
                {genreLabel(g, lang)}
              </span>
            ))}
          </div>
          <div className="hero__actions">
            <Link to={`/watch/${item.id}`} className="hero__watch-btn">
              <PlayIcon width={20} height={20} />
              <span className="hero__watch-btn-text">
                <strong>{t('common.watchNow')}</strong>
                <small>
                  {genreLabel(item.genres[0], lang)} · {item.year}
                </small>
              </span>
            </Link>
            <button
              type="button"
              className={`hero__icon-btn ${saved ? 'is-active' : ''}`}
              onClick={() => toggleList(item.id)}
              aria-pressed={saved}
              aria-label={saved ? t('common.removeFromList') : t('common.addToList')}
            >
              {saved ? <CheckIcon width={18} height={18} /> : <HeartIcon width={18} height={18} />}
            </button>
            <Link to={`/title/${item.id}`} className="hero__icon-btn" aria-label={t('common.moreInfo')}>
              <InfoIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <div className="hero__dots">
          {items.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={`hero__dot ${i === index ? 'is-active' : ''}`}
              aria-label={slide.title[lang]}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
