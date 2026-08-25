import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { CHANNELS, findChannel } from '../data/channels';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ChannelCard from '../components/ChannelCard';
import EpgList from '../components/EpgList';
import { PlayIcon } from '../components/icons';
import './LivePage.css';

export default function LivePage() {
  const { t, lang } = useI18n();
  const [params] = useSearchParams();
  const requestedId = params.get('channel');
  const [activeId, setActiveId] = useState((requestedId && findChannel(requestedId)?.id) || CHANNELS[0].id);
  const channel = CHANNELS.find((c) => c.id === activeId) ?? CHANNELS[0];

  return (
    <div className="live-page">
      <section className="live-hero" style={{ backgroundImage: `url("${channel.thumbnail}")` }}>
        <div className="live-hero__scrim" />
        <div className="live-hero__content container">
          <div className="live-hero__badges">
            <Badge tone="live">{t('common.live')}</Badge>
            <span className="live-hero__channel">{channel.name[lang]}</span>
          </div>
          <h1 className="live-hero__title">{channel.nowPlaying.title[lang]}</h1>
          <p className="live-hero__next">
            {t('live.upNext')}: {channel.upNext.title[lang]} · {channel.upNext.time}
          </p>
          <Button as={Link} to={`/watch/${channel.id}`} variant="primary" size="lg" icon={<PlayIcon />}>
            {t('live.watchLive')}
          </Button>
        </div>
      </section>

      {/* Mobile-only trial of a circular "now airing" row (see conversation) — each
          channel's own current-program art in a ring, rather than its logo, since a
          photo crops into a circle cleanly and a wordmark logo doesn't. Purely additive:
          the existing channel list below is untouched, so this is a one-block revert if
          it doesn't work out. */}
      <div className="live-page__circles container">
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`live-page__circle ${c.id === activeId ? 'is-active' : ''}`}
            onClick={() => setActiveId(c.id)}
          >
            <span className="live-page__circle-ring">
              <img src={c.thumbnail} alt="" />
            </span>
            <span className="live-page__circle-name line-clamp-1">{c.name[lang]}</span>
          </button>
        ))}
      </div>

      <div className="container live-page__grid">
        <div className="live-page__channels">
          <h2 className="live-page__heading">{t('live.allChannels')}</h2>
          <div className="live-page__channel-list">
            {CHANNELS.map((c) => (
              <ChannelCard key={c.id} channel={c} active={c.id === activeId} onSelect={() => setActiveId(c.id)} />
            ))}
          </div>
        </div>
        <div className="live-page__epg">
          <EpgList channel={channel} />
        </div>
      </div>
    </div>
  );
}
