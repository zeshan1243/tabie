import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import { useI18n } from '../i18n/I18nContext';
import { HomeIcon, SearchIcon, MovieIcon, SeriesIcon, LiveIcon, SportsIcon, ListIcon, SettingsIcon } from '../components/icons';
import './Sidebar.css';

const LINKS = [
  { to: '/', key: 'nav.home', icon: HomeIcon, match: (loc) => loc.pathname === '/' },
  {
    to: '/search',
    key: 'nav.search',
    icon: SearchIcon,
    match: (loc) => loc.pathname === '/search' && !new URLSearchParams(loc.search).get('type') && !new URLSearchParams(loc.search).get('genre'),
  },
  {
    to: '/search?type=movie',
    key: 'nav.movies',
    icon: MovieIcon,
    match: (loc) => loc.pathname === '/search' && new URLSearchParams(loc.search).get('type') === 'movie',
  },
  {
    to: '/search?type=series',
    key: 'nav.series',
    icon: SeriesIcon,
    match: (loc) => loc.pathname === '/search' && new URLSearchParams(loc.search).get('type') === 'series',
  },
  { to: '/live', key: 'nav.live', icon: LiveIcon, match: (loc) => loc.pathname === '/live' },
  {
    to: '/search?genre=sports',
    key: 'nav.sports',
    icon: SportsIcon,
    match: (loc) => loc.pathname === '/search' && new URLSearchParams(loc.search).get('genre') === 'sports',
  },
  { to: '/my-list', key: 'nav.myList', icon: ListIcon, match: (loc) => loc.pathname === '/my-list' },
  { to: '/profile', key: 'nav.settings', icon: SettingsIcon, match: (loc) => loc.pathname === '/profile' },
];

// Clicking a link focuses it, and that focus lingers after the mouse leaves — which
// kept the sidebar's `:focus-within` expand-trigger active until something else was
// clicked. Blurring right after the click clears it so hovering out collapses normally,
// while keyboard Tab-focus (which fires a real 'focus' event, not blurred here) still
// expands the sidebar for keyboard/TV navigation.
function blurOnClick(e) {
  e.currentTarget.blur();
}

export default function Sidebar() {
  const { t } = useI18n();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar__logo" aria-label="Tabie Home" onClick={blurOnClick}>
        <Logo size="md" />
      </Link>

      <nav className="sidebar__nav" aria-label="Primary">
        {LINKS.map(({ to, key, icon: Icon, match }) => {
          const isActive = match(location);
          return (
            <Link key={key} to={to} className={`sidebar__link ${isActive ? 'is-active' : ''}`} onClick={blurOnClick}>
              <Icon className="sidebar__link-icon" width={20} height={20} />
              <span className="sidebar__link-label">{t(key)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
