import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import './ChannelTile.css';

// Real broadcaster logo, background keyed out to transparent (see data/channels.js) so
// it sits on our own theme tile — falls back to a text wordmark for a channel with no
// logo yet.
export default function ChannelTile({ channel }) {
  const { lang } = useI18n();
  return (
    <Link to={`/live?channel=${channel.id}`} className="channel-tile" aria-label={channel.name[lang]}>
      {channel.logo ? (
        <img src={channel.logo} alt="" />
      ) : (
        <span className="channel-tile__name">{channel.name[lang]}</span>
      )}
    </Link>
  );
}
