import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { PlayIcon } from './icons';
import './EpisodeRow.css';

export default function EpisodeRow({ titleId, episode, active }) {
  const { t, lang } = useI18n();
  return (
    <Link to={`/watch/${titleId}?ep=${episode.number}`} className={`episode-row ${active ? 'is-active' : ''}`}>
      <span className="episode-row__number">{episode.number}</span>
      <div className="episode-row__thumb">
        <img src={episode.thumbnail} alt="" loading="lazy" />
        <span className="episode-row__play">
          <PlayIcon width={16} height={16} />
        </span>
      </div>
      <div className="episode-row__body">
        <p className="episode-row__title line-clamp-1">{episode.title[lang]}</p>
        <p className="episode-row__meta">
          {episode.duration} {t('common.minutes')}
        </p>
        <p className="episode-row__synopsis line-clamp-2">{episode.synopsis[lang]}</p>
      </div>
    </Link>
  );
}
