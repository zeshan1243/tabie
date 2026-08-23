import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import Badge from './Badge';
import {
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  MuteIcon,
  FullscreenIcon,
  SubtitleIcon,
  SettingsIcon,
  SeriesIcon,
  RewindIcon,
  ForwardIcon,
} from './icons';
import './PlayerControls.css';

const QUALITIES = ['auto', '1080p', '720p', '480p'];
const SUBTITLE_OPTIONS = [
  { id: 'off', en: 'Off', ar: 'إيقاف' },
  { id: 'en', en: 'English', ar: 'الإنجليزية' },
  { id: 'ar', en: 'Arabic', ar: 'العربية' },
];

export default function PlayerControls({
  isLive,
  isPlaying,
  onTogglePlay,
  progressPct,
  onSeek,
  currentLabel,
  durationLabel,
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  subtitleLang,
  onSetSubtitle,
  quality,
  onSetQuality,
  onFullscreen,
  onRewind,
  onForward,
  onToggleEpisodes,
  episodesOpen,
}) {
  const { t, lang } = useI18n();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (name) => setOpenMenu((prev) => (prev === name ? null : name));

  return (
    <div className="player-controls" onClick={(e) => e.stopPropagation()}>
      {!isLive && (
        <div className="player-controls__scrub">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progressPct}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="player-controls__range"
            style={{ '--pct': `${progressPct}%` }}
            aria-label="Seek"
          />
        </div>
      )}

      <div className="player-controls__row">
        <div className="player-controls__group">
          <button type="button" className="player-controls__btn" onClick={onTogglePlay} aria-label={isPlaying ? t('player.pause') : t('common.play')}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          {!isLive && (
            <>
              <button type="button" className="player-controls__btn player-controls__btn--sm" onClick={onRewind} aria-label="Rewind 10 seconds">
                <RewindIcon width={18} height={18} />
              </button>
              <button type="button" className="player-controls__btn player-controls__btn--sm" onClick={onForward} aria-label="Forward 10 seconds">
                <ForwardIcon width={18} height={18} />
              </button>
            </>
          )}

          <div className="player-controls__volume">
            <button type="button" className="player-controls__btn player-controls__btn--sm" onClick={onToggleMute} aria-label="Mute">
              {muted || volume === 0 ? <MuteIcon width={18} height={18} /> : <VolumeIcon width={18} height={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="player-controls__range player-controls__range--volume"
              style={{ '--pct': `${muted ? 0 : volume}%` }}
              aria-label="Volume"
            />
          </div>

          {isLive ? (
            <Badge tone="live">{t('common.live')}</Badge>
          ) : (
            <span className="player-controls__time">
              {currentLabel} / {durationLabel}
            </span>
          )}
        </div>

        <div className="player-controls__group">
          {onToggleEpisodes && (
            <button
              type="button"
              className={`player-controls__btn player-controls__btn--sm ${episodesOpen ? 'is-active' : ''}`}
              onClick={onToggleEpisodes}
              aria-label={t('player.episodes')}
              aria-pressed={episodesOpen}
            >
              <SeriesIcon width={18} height={18} />
            </button>
          )}

          <div className="player-controls__menu-wrap">
            <button type="button" className="player-controls__btn player-controls__btn--sm" onClick={() => toggleMenu('subtitles')} aria-label={t('player.subtitles')}>
              <SubtitleIcon width={18} height={18} />
            </button>
            {openMenu === 'subtitles' && (
              <div className="player-controls__menu">
                <p className="player-controls__menu-title">{t('player.subtitles')}</p>
                {SUBTITLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`player-controls__menu-item ${subtitleLang === opt.id ? 'is-active' : ''}`}
                    onClick={() => {
                      onSetSubtitle(opt.id);
                      setOpenMenu(null);
                    }}
                  >
                    {opt[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isLive && (
            <div className="player-controls__menu-wrap">
              <button type="button" className="player-controls__btn player-controls__btn--sm" onClick={() => toggleMenu('quality')} aria-label={t('player.quality')}>
                <SettingsIcon width={18} height={18} />
              </button>
              {openMenu === 'quality' && (
                <div className="player-controls__menu">
                  <p className="player-controls__menu-title">{t('player.quality')}</p>
                  {QUALITIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`player-controls__menu-item ${quality === q ? 'is-active' : ''}`}
                      onClick={() => {
                        onSetQuality(q);
                        setOpenMenu(null);
                      }}
                    >
                      {q === 'auto' ? t('player.auto') : q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button type="button" className="player-controls__btn player-controls__btn--sm" onClick={onFullscreen} aria-label="Fullscreen">
            <FullscreenIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
