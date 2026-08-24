import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import './ChannelTile.css';

// The source logo PNGs are baked onto an opaque white canvas, so they only ever read
// correctly on a light tile — see the note in data/channels.js. Rendered as a text
// wordmark on one shared dark tile color (ChannelTile.css) instead, so it works on the
// dark theme.
export default function ChannelTile({ channel }) {
  const { lang } = useI18n();
  return (
    <Link to={`/live?channel=${channel.id}`} className="channel-tile">
      <span className="channel-tile__name">{channel.name[lang]}</span>
    </Link>
  );
}
