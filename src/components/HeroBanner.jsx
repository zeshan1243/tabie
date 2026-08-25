import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import { genreLabel } from '../data/genres';
import Button from './Button';
import Badge from './Badge';
import { PlayIcon, InfoIcon, CalendarIcon, HeartIcon, CheckIcon } from './icons';
import './HeroBanner.css';

const ROTATE_MS = 7500;
// A handful of genres shown as filter-style pills above the mobile hero card, each on
// its own accent color so the row reads at a glance rather than as one flat list.
const PILL_GENRES = ['drama', 'action', 'documentary', 'sports', 'family'];
const PILL_COLORS = ['#e0344c', '#3b5bdb', '#7a2e4a', '#d9832a', '#2f9e56'];

export default function HeroBanner({ items }) {
  const { t, lang } = useI18n();
  const { isInList, toggleList } = useAppState();
  const [index, setIndex] = useState(0);
  const item = items[index];

  useEffect(() => {
    if (items.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  const goTo = useCallback((i) => setIndex(i), []);

  // Swipe-to-change-slide. A short tap (no real horizontal movement) falls through to
  // whatever button/link is underneath — it's only a real swipe past the threshold that
  // changes the slide, so this never steals a tap on the actions below.
  const swipe = useRef({ startX: 0 });
  const onTouchStart = (e) => {
    swipe.current.startX = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - swipe.current.startX;
    if (Math.abs(dx) < 40 || items.length < 2) return;
    // Finger moving left reveals the next slide, moving right the previous one — the
    // same visual convention regardless of writing direction.
    setIndex((i) => (dx < 0 ? (i + 1) % items.length : (i - 1 + items.length) % items.length));
  };

  // The active pill follows whichever genre the current slide actually has, rather than
  // being independently clickable — HERO_ITEMS is a small curated rotation, not a full
  // per-genre catalog, so a real filter would empty out for most picks.
  const activePillGenre = useMemo(() => item?.genres.find((g) => PILL_GENRES.includes(g)) ?? PILL_GENRES[0], [item]);

  if (!item) return null;

  const saved = isInList(item.id);

  return (
    <section className="hero" aria-label={item.title[lang]}>
      <div className="hero__pills container" role="tablist" aria-hidden="true">
        {PILL_GENRES.map((g, i) => (
          <span
            key={g}
            className={`hero__pill ${g === activePillGenre ? 'is-active' : ''}`}
            style={{ '--pill-color': PILL_COLORS[i] }}
          >
            {genreLabel(g, lang)}
          </span>
        ))}
      </div>

      <div className="hero__card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {items.map((slide, i) => (
          <div key={slide.id} className={`hero__bg ${i === index ? 'is-active' : ''}`} style={{ backgroundImage: `url("${slide.backdrop}")` }} />
        ))}
        <div className="hero__scrim" />
        <div className="hero__content container">
          <p className="hero__eyebrow">{t('home.heroEyebrow')}</p>
          <h1 className="hero__title">{item.title[lang]}</h1>
          <p className="hero__date">
            <CalendarIcon width={15} height={15} />
            {item.year}
          </p>
          <div className="hero__meta">
            <Badge tone="outline">{item.rating}</Badge>
            <span>{item.year}</span>
            <span>{item.genres.slice(0, 3).map((g) => genreLabel(g, lang)).join(' · ')}</span>
          </div>
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
