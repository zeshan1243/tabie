import { useI18n } from '../i18n/I18nContext';
import Badge from './Badge';
import './EpgList.css';

export default function EpgList({ channel }) {
  const { t, lang } = useI18n();
  return (
    <div className="epg">
      <div className="epg__head">
        <h3>{t('live.schedule')}</h3>
        <Badge tone="outline">{t('live.today')}</Badge>
      </div>
      <ol className="epg__list">
        {channel.schedule.map((slot) => {
          const isNow = slot === channel.nowPlaying;
          return (
            <li key={slot.time} className={`epg__row ${isNow ? 'is-now' : ''}`}>
              <span className="epg__time">{slot.time}</span>
              <span className="epg__title line-clamp-1">{slot.title[lang]}</span>
              {isNow && <Badge tone="live">{t('live.onNow')}</Badge>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
