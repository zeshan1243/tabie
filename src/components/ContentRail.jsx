import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import ContentCard from './ContentCard';
import SkeletonCard from './SkeletonCard';
import { ChevronStart, ChevronEnd } from './icons';
import './ContentRail.css';

export default function ContentRail({ title, items = [], seeAllHref, orientation = 'portrait', loading = false, progressMap }) {
  const { t, isRtl } = useI18n();
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * dir * (isRtl ? -1 : 1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="rail">
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
        <div className="rail__track hide-scrollbar container" ref={trackRef}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} orientation={orientation} />)
            : items.map((item) => (
                <ContentCard key={item.id} item={item} orientation={orientation} progress={progressMap ? progressMap[item.id] : undefined} />
              ))}
        </div>
        <button type="button" className="rail__nav rail__nav--next" onClick={() => scrollBy(1)} aria-label={t('common.seeAll')}>
          <ChevronEnd />
        </button>
      </div>
    </section>
  );
}
