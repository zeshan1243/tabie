import { NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { HomeIcon, LiveIcon, SearchIcon, SettingsIcon } from '../components/icons';
import './BottomNav.css';

// Colors run in tab order starting from Home, per spec. `text` is the readable
// foreground for that fill — the two darker colors get white text, the two lighter
// ones get a dark one, rather than a single color that would lose contrast on half of them.
const LINKS = [
  { to: '/', key: 'nav.home', icon: HomeIcon, end: true, color: '#0a1f5c', text: '#ffffff' },
  { to: '/live', key: 'nav.live', icon: LiveIcon, color: '#2cd2c0', text: '#04231f' },
  { to: '/search', key: 'nav.search', icon: SearchIcon, color: '#5b2ec7', text: '#ffffff' },
  { to: '/profile', key: 'nav.settings', icon: SettingsIcon, color: '#e6e6e6', text: '#0a1f5c' },
];

function isLinkActive(pathname, link) {
  return link.end ? pathname === link.to : pathname === link.to || pathname.startsWith(`${link.to}/`);
}

export default function BottomNav() {
  const { t } = useI18n();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__segments" aria-hidden="true">
        {LINKS.map((link) => (
          <span
            key={link.to}
            className={`bottom-nav__segment${isLinkActive(pathname, link) ? ' is-active' : ''}`}
            style={{ '--segment-color': link.color }}
          />
        ))}
      </div>
      {LINKS.map(({ to, key, icon: Icon, end, color, text }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `bottom-nav__link ${isActive ? 'is-active' : ''}`}
          style={{ '--tab-color': color, '--tab-text': text }}
        >
          <Icon width={21} height={21} />
          <span>{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
