import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import './ChannelTile.css';

export default function ChannelTile({ channel }) {
  const { lang } = useI18n();
  return (
    <Link to={`/live?channel=${channel.id}`} className="channel-tile">
      <img src={channel.logo} alt={channel.name[lang]} loading="lazy" />
    </Link>
  );
}
