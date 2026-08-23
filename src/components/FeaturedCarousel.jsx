import { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { genreLabel } from '../data/genres';
import FeaturedCard from './FeaturedCard';
import { ChevronStart, ChevronEnd, PlayIcon, InfoIcon } from './icons';
import './FeaturedCarousel.css';

export default function FeaturedCarousel({ title, items, seeAllHref }) {
  const { t, lang, isRtl } = useI18n();
  const trackRef = useRef(null);

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

        <div className="featured-carousel__track hide-scrollbar container" ref={trackRef}>
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
