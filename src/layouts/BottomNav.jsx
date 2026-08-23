import { NavLink } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { HomeIcon, LiveIcon, SearchIcon, ListIcon, SettingsIcon } from '../components/icons';
import './BottomNav.css';

const LINKS = [
  { to: '/', key: 'nav.home', icon: HomeIcon, end: true },
  { to: '/live', key: 'nav.live', icon: LiveIcon },
  { to: '/search', key: 'nav.search', icon: SearchIcon },
  { to: '/my-list', key: 'nav.myList', icon: ListIcon },
  { to: '/profile', key: 'nav.settings', icon: SettingsIcon },
];

export default function BottomNav() {
  const { t } = useI18n();
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {LINKS.map(({ to, key, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `bottom-nav__link ${isActive ? 'is-active' : ''}`}>
          <Icon width={21} height={21} />
          <span>{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
