import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { genreLabel } from '../data/genres';
import Button from './Button';
import Badge from './Badge';
import { PlayIcon, InfoIcon } from './icons';
import './HeroBanner.css';

const ROTATE_MS = 7500;

export default function HeroBanner({ items }) {
  const { t, lang } = useI18n();
  const [index, setIndex] = useState(0);
  const item = items[index];

  useEffect(() => {
    if (items.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  const goTo = useCallback((i) => setIndex(i), []);

  if (!item) return null;

  return (
    <section className="hero" aria-label={item.title[lang]}>
      {items.map((slide, i) => (
        <div key={slide.id} className={`hero__bg ${i === index ? 'is-active' : ''}`} style={{ backgroundImage: `url("${slide.backdrop}")` }} />
      ))}
      <div className="hero__scrim" />
      <div className="hero__content container">
        <p className="hero__eyebrow">{t('home.heroEyebrow')}</p>
        <h1 className="hero__title">{item.title[lang]}</h1>
        <div className="hero__meta">
          <Badge tone="outline">{item.rating}</Badge>
          <span>{item.year}</span>
          <span>{item.genres.slice(0, 3).map((g) => genreLabel(g, lang)).join(' · ')}</span>
        </div>
        <p className="hero__synopsis line-clamp-2">{item.synopsis[lang]}</p>
        <div className="hero__actions">
          <Button as={Link} to={`/watch/${item.id}`} variant="primary" size="lg" icon={<PlayIcon />}>
            {t('common.watchNow')}
          </Button>
          <Button as={Link} to={`/title/${item.id}`} variant="secondary" size="lg" icon={<InfoIcon />}>
            {t('common.moreInfo')}
          </Button>
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
