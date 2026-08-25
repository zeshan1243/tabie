import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import { genreLabel } from '../data/genres';
import Button from './Button';
import { PlayIcon, InfoIcon, CalendarIcon, HeartIcon, CheckIcon } from './icons';
import './HeroBanner.css';

const ROTATE_MS = 7500;
const SWIPE_THRESHOLD = 40;

export default function HeroBanner({ items }) {
  const { t, lang } = useI18n();
  const { isInList, toggleList } = useAppState();
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

  if (!item) return null;

  const saved = isInList(item.id);

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
            <Button as={Link} to={`/watch/${item.id}`} variant="primary" size="lg" icon={<PlayIcon />}>
              {t('common.watchNow')}
            </Button>
            <Button as={Link} to={`/title/${item.id}`} variant="secondary" size="lg" icon={<InfoIcon />} className="hero__info-btn">
              {t('common.moreInfo')}
            </Button>
            <button
              type="button"
              className={`hero__save ${saved ? 'is-active' : ''}`}
              onClick={() => toggleList(item.id)}
              aria-pressed={saved}
              aria-label={saved ? t('common.removeFromList') : t('common.addToList')}
            >
              {saved ? <CheckIcon width={18} height={18} /> : <HeartIcon width={18} height={18} />}
            </button>
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
