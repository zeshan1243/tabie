import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import { findById, buildEpisodes } from '../data/catalog';
import { findChannel } from '../data/channels';
import { formatTime } from '../utils/format';
import Badge from '../components/Badge';
import PlayerControls from '../components/PlayerControls';
import EpisodeRow from '../components/EpisodeRow';
import { PlayIcon, CloseIcon, ChevronStart } from '../components/icons';
import './PlayerPage.css';

const SIM_SECONDS = 100; // wall-clock length of the simulated playthrough
const CONTROLS_HIDE_MS = 3200;
const UPNEXT_TRIGGER_PCT = 90;
const UPNEXT_COUNTDOWN = 8;
// A single short CC0 clip stands in for every title's actual footage (this is a
// frontend-only prototype with no real video library) — it loops continuously while
// playing; the scrub bar/time labels below are still driven by the simulated
// long-form duration, independent of the clip's own short real length.
const SAMPLE_VIDEO_SRC = '/video/sample.mp4';

export default function PlayerPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { settings } = useAppState();

  const item = findById(id);
  const channel = !item ? findChannel(id) : null;
  const isLive = Boolean(channel);
  const isTrailer = searchParams.get('trailer') === '1';
  const episodeNumber = Number(searchParams.get('ep')) || 1;

  const episodes = useMemo(() => (item?.type === 'series' ? buildEpisodes(item, 1) : []), [item]);
  const currentEpisode = episodes.find((e) => e.number === episodeNumber);
  const nextEpisode = episodes.find((e) => e.number === episodeNumber + 1);

  const durationMinutes = isTrailer ? 2 : currentEpisode?.duration || item?.duration || 45;
  const durationSeconds = durationMinutes * 60;

  const [isPlaying, setIsPlaying] = useState(true);
  const [progressPct, setProgressPct] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [subtitleLang, setSubtitleLang] = useState(settings.subtitleLanguage === 'ar' ? 'ar' : 'off');
  const [quality, setQuality] = useState(settings.defaultQuality || 'auto');
  const [showControls, setShowControls] = useState(true);
  const [upNextCountdown, setUpNextCountdown] = useState(null);
  const [episodesOpen, setEpisodesOpen] = useState(false);
  const hideTimer = useRef(null);
  const upNextTriggered = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const videoRef = useRef(null);

  // Drive the real <video> element from isPlaying rather than the other way around —
  // browsers can silently block autoplay, so if play() rejects we fall back to the
  // paused/poster state instead of leaving the UI showing "playing" incorrectly.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume / 100;
    video.muted = muted;
  }, [volume, muted]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, CONTROLS_HIDE_MS);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulated playback progress
  useEffect(() => {
    if (isLive || !isPlaying) return undefined;
    const id_ = setInterval(() => {
      setProgressPct((p) => Math.min(100, p + 100 / SIM_SECONDS));
    }, 1000);
    return () => clearInterval(id_);
  }, [isPlaying, isLive]);

  // Close the episodes panel automatically once a new episode has actually loaded.
  useEffect(() => {
    setEpisodesOpen(false);
  }, [episodeNumber]);

  // Up next trigger for series
  useEffect(() => {
    if (isLive || !nextEpisode) return;
    if (progressPct >= UPNEXT_TRIGGER_PCT && !upNextTriggered.current) {
      upNextTriggered.current = true;
      setUpNextCountdown(UPNEXT_COUNTDOWN);
    }
  }, [progressPct, isLive, nextEpisode]);

  useEffect(() => {
    if (upNextCountdown === null) return undefined;
    if (upNextCountdown <= 0) {
      navigate(`/watch/${item.id}?ep=${episodeNumber + 1}`, { replace: true });
      return undefined;
    }
    const t_ = setTimeout(() => setUpNextCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t_);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upNextCountdown]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        setIsPlaying((p) => !p);
        resetHideTimer();
      } else if (e.key === 'ArrowRight') {
        setProgressPct((p) => Math.min(100, p + 5));
        resetHideTimer();
      } else if (e.key === 'ArrowLeft') {
        setProgressPct((p) => Math.max(0, p - 5));
        resetHideTimer();
      } else if (e.key === 'm') {
        setMuted((m) => !m);
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setEpisodesOpen((open) => {
          if (open) return false;
          navigate(-1);
          return open;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    } catch {
      // fullscreen unsupported in this environment — no-op for the prototype
    }
  };

  if (!item && !channel) return <Navigate to="/" replace />;

  const title = isLive ? channel.nowPlaying.title[lang] : item.title[lang];
  const backdrop = isLive ? channel.thumbnail : currentEpisode?.thumbnail || item.backdrop;
  const captionChunks = !isLive ? item.synopsis[lang].split(' ') : [];
  const captionGroups = [];
  for (let i = 0; i < captionChunks.length; i += 7) captionGroups.push(captionChunks.slice(i, i + 7).join(' '));
  const captionText = captionGroups.length ? captionGroups[Math.floor(progressPct / 12) % captionGroups.length] : '';

  return (
    <div
      className={`player ${showControls ? 'show-controls' : ''}`}
      onMouseMove={resetHideTimer}
      onClick={() => {
        setIsPlaying((p) => !p);
        resetHideTimer();
      }}
    >
      <video
        ref={videoRef}
        src={SAMPLE_VIDEO_SRC}
        poster={backdrop}
        className="player__backdrop"
        loop
        playsInline
        muted={muted}
        aria-hidden="true"
      />
      <div className="player__vignette" />

      {!isLive && subtitleLang !== 'off' && captionText && (
        <p className="player__caption">{captionText}</p>
      )}

      <div className="player__top" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="player__back" onClick={() => navigate(-1)} aria-label={t('common.back')}>
          <ChevronStart />
        </button>
        <div className="player__top-info">
          <p className="player__top-title line-clamp-1">{title}</p>
          {!isLive && item.type === 'series' && (
            <p className="player__top-sub">
              {t('details.season')} 1 · {t('common.episode')} {episodeNumber}
            </p>
          )}
        </div>
        <div className="player__top-badges">
          {isTrailer && <Badge tone="gold">{t('player.trailerBadge')}</Badge>}
          {isLive && <Badge tone="live">{t('common.live')}</Badge>}
        </div>
        <Link to={isLive ? '/live' : `/title/${item.id}`} className="player__exit" aria-label={t('player.exit')}>
          <CloseIcon />
        </Link>
      </div>

      {!isPlaying && (
        <button type="button" className="player__big-play" onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }} aria-label={t('common.play')}>
          <PlayIcon width={34} height={34} />
        </button>
      )}

      {upNextCountdown !== null && nextEpisode && (
        <div className="player__upnext" onClick={(e) => e.stopPropagation()}>
          <img src={nextEpisode.thumbnail} alt="" />
          <div className="player__upnext-body">
            <p className="player__upnext-label">
              {t('player.playingNext')} · {upNextCountdown}s
            </p>
            <p className="player__upnext-title line-clamp-1">{nextEpisode.title[lang]}</p>
            <div className="player__upnext-actions">
              <button
                type="button"
                className="player__upnext-btn player__upnext-btn--primary"
                onClick={() => navigate(`/watch/${item.id}?ep=${episodeNumber + 1}`, { replace: true })}
              >
                {t('player.playNow')}
              </button>
              <button type="button" className="player__upnext-btn" onClick={() => setUpNextCountdown(null)}>
                {t('player.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLive && item.type === 'series' && episodes.length > 0 && (
        <div className={`player__episodes ${episodesOpen ? 'is-open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="player__episodes-header">
            <h3>{t('player.episodes')}</h3>
            <button type="button" className="player__episodes-close" onClick={() => setEpisodesOpen(false)} aria-label={t('common.close')}>
              <CloseIcon width={18} height={18} />
            </button>
          </div>
          <div className="player__episodes-list">
            {episodes.map((ep) => (
              <EpisodeRow key={ep.id} titleId={item.id} episode={ep} active={ep.number === episodeNumber} />
            ))}
          </div>
        </div>
      )}

      <PlayerControls
        isLive={isLive}
        onToggleEpisodes={!isLive && item.type === 'series' && episodes.length > 0 ? () => setEpisodesOpen((o) => !o) : undefined}
        episodesOpen={episodesOpen}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        progressPct={progressPct}
        onSeek={setProgressPct}
        currentLabel={formatTime((progressPct / 100) * durationSeconds)}
        durationLabel={formatTime(durationSeconds)}
        volume={volume}
        muted={muted}
        onVolumeChange={(v) => {
          setVolume(v);
          setMuted(false);
        }}
        onToggleMute={() => setMuted((m) => !m)}
        subtitleLang={subtitleLang}
        onSetSubtitle={setSubtitleLang}
        quality={quality}
        onSetQuality={setQuality}
        onFullscreen={toggleFullscreen}
        onRewind={() => setProgressPct((p) => Math.max(0, p - 10))}
        onForward={() => setProgressPct((p) => Math.min(100, p + 10))}
      />
    </div>
  );
}
