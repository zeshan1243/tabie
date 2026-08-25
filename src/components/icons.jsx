// Minimal, consistent icon set — stroke-based, 24x24, currentColor.
const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const PlayIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 5.5v13l11-6.5-11-6.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const PauseIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="7" y="5" width="4" height="14" fill="currentColor" stroke="none" />
    <rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none" />
  </svg>
);

export const PlusIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

// Point toward the start/end of reading order, not literal left/right — so they
// need to flip under [dir='rtl'] (see global.css) to still point the correct way.
export const ChevronStart = (p) => (
  <svg {...base} className="icon-chevron-start" {...p}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const ChevronEnd = (p) => (
  <svg {...base} className="icon-chevron-end" {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const InfoIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5v.01" />
  </svg>
);

export const VolumeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
    <path d="M17 8.5a5 5 0 010 7M19.5 6a8.5 8.5 0 010 12" />
  </svg>
);

export const MuteIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
    <path d="M16 9l5 6M21 9l-5 6" />
  </svg>
);

export const FullscreenIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M8 3H4v4M16 3h4v4M8 21H4v-4M16 21h4v-4" />
  </svg>
);

export const SubtitleIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 14h4M13 14h4M7 10h10" />
  </svg>
);

export const SettingsIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.6 1z" />
  </svg>
);

export const HomeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10" />
  </svg>
);

export const LiveIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M8 3l4 3 4-3M9 12h6" />
  </svg>
);

export const ListIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h9" />
  </svg>
);

export const UserIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

export const TrashIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </svg>
);

export const StarIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l2.6 5.8 6.4.6-4.8 4.2 1.4 6.2L12 16.9 6.4 19.8l1.4-6.2L3 9.4l6.4-.6L12 3z" fill="currentColor" stroke="none" />
  </svg>
);

export const ClockIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const CalendarIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

export const HeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20.2s-7.6-4.6-9.8-9.3C.6 7.4 2.4 4 5.9 4c2 0 3.4 1 4.7 2.6l1.4 1.7 1.4-1.7C14.7 5 16.1 4 18.1 4c3.5 0 5.3 3.4 3.7 6.9-2.2 4.7-9.8 9.3-9.8 9.3z" />
  </svg>
);

export const ShareIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5" r="2.4" />
    <circle cx="6" cy="12" r="2.4" />
    <circle cx="18" cy="19" r="2.4" />
    <path d="M8.2 10.8l7.6-4.2M8.2 13.2l7.6 4.2" />
  </svg>
);

export const RewindIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 19V5l-8 7 8 7z" fill="currentColor" stroke="none" />
    <path d="M21 19V5l-8 7 8 7z" fill="currentColor" stroke="none" />
  </svg>
);

export const ForwardIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14l8-7-8-7z" fill="currentColor" stroke="none" />
    <path d="M3 5v14l8-7-8-7z" fill="currentColor" stroke="none" />
  </svg>
);

export const MovieIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 4v5M16 4v5M3 15h5M16 15h5" />
  </svg>
);

export const SeriesIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="6" y="7" width="15" height="10" rx="1.6" />
    <path d="M3 4.5h11M3 8v9a1.6 1.6 0 001.6 1.6H9" />
  </svg>
);

export const SportsIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 4h12v3a6 6 0 01-12 0V4z" />
    <path d="M6 5H3.5A2.5 2.5 0 006 7.5M18 5h2.5A2.5 2.5 0 0118 7.5" />
    <path d="M12 13v3M9 20h6M8.5 16.5h7v.5a3.5 3.5 0 01-3.5 3.5v0a3.5 3.5 0 01-3.5-3.5v-.5z" />
  </svg>
);
