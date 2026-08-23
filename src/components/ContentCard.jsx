import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import { genreLabel } from '../data/genres';
import ProgressBar from './ProgressBar';
import { PlayIcon, PlusIcon, CheckIcon, TrashIcon, InfoIcon } from './icons';
import './ContentCard.css';

export default function ContentCard({ item, orientation = 'portrait', progress, removable = false }) {
  const { t, lang } = useI18n();
  const { isInList, toggleList, removeFromList } = useAppState();
  const saved = isInList(item.id);
  const art = orientation === 'landscape' ? item.backdrop : item.poster;
  const detailsHref = `/title/${item.id}`;

  const metaParts = [
    item.year,
    item.seasons ? `${item.seasons} ${item.seasons === 1 ? t('details.season') : t('common.seasons')}` : item.duration ? `${item.duration} ${t('common.minutes')}` : null,
    item.genres.slice(0, 2).map((g) => genreLabel(g, lang)).join(' · '),
  ].filter(Boolean);

  return (
    <div className={`content-card content-card--${orientation}`}>
      <Link to={detailsHref} className="content-card__media" aria-label={item.title[lang]}>
        <img src={art} alt="" loading="lazy" />
        <div className="content-card__overlay" />
        {typeof progress === 'number' && (
          <div className="content-card__progress">
            <ProgressBar value={progress} />
          </div>
        )}
      </Link>

      <div className="content-card__content">
        <p className="content-card__title">{item.title[lang]}</p>
        <div className="content-card__meta-row">
          {item.rating && <span className="content-card__pill content-card__pill--outline">{item.rating}</span>}
          <span className="content-card__metadata">{metaParts.join(' • ')}</span>
          {item.tags?.includes('newRelease') && <span className="content-card__pill content-card__pill--gold">{t('common.new')}</span>}
        </div>

        <p className="content-card__description line-clamp-2">{item.synopsis[lang]}</p>

        <div className="content-card__actions">
          <Link to={`/watch/${item.id}`} className="content-card__action is-primary" aria-label={t('common.play')}>
            <PlayIcon width={14} height={14} />
            <span>{t('common.watchNow')}</span>
          </Link>
          {removable ? (
            <button type="button" className="content-card__action content-card__action--danger" onClick={() => removeFromList(item.id)} aria-label={t('common.removeFromList')}>
              <TrashIcon width={15} height={15} />
            </button>
          ) : (
            <button
              type="button"
              className={`content-card__action ${saved ? 'is-active' : ''}`}
              onClick={() => toggleList(item.id)}
              aria-pressed={saved}
              aria-label={saved ? t('common.removeFromList') : t('common.addToList')}
            >
              {saved ? <CheckIcon width={15} height={15} /> : <PlusIcon width={15} height={15} />}
            </button>
          )}
          <Link to={detailsHref} className="content-card__action" aria-label={t('common.moreInfo')}>
            <InfoIcon width={15} height={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
