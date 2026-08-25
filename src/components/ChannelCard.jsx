import { useI18n } from '../i18n/I18nContext';
import ProgressBar from './ProgressBar';
import Badge from './Badge';
import './ChannelCard.css';

export default function ChannelCard({ channel, active, onSelect }) {
  const { t, lang } = useI18n();
  return (
    <button type="button" className={`channel-card ${active ? 'is-active' : ''}`} onClick={onSelect}>
      <div className="channel-card__logo">
        {channel.logo ? <img src={channel.logo} alt="" /> : <span className="channel-card__initials">{channel.name[lang].slice(0, 3)}</span>}
      </div>
      <div className="channel-card__body">
        <p className="channel-card__name line-clamp-1">{channel.name[lang]}</p>
        <p className="channel-card__program line-clamp-1">{channel.nowPlaying.title[lang]}</p>
        <ProgressBar value={channel.progress} />
      </div>
      <Badge tone="live" className="channel-card__badge">
        {t('common.live')}
      </Badge>
    </button>
  );
}
