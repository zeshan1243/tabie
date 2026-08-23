import { useMemo } from 'react';
import { useI18n } from '../i18n/I18nContext';
import HeroBanner from '../components/HeroBanner';
import ContentRail from '../components/ContentRail';
import FeaturedCarousel from '../components/FeaturedCarousel';
import ChannelTile from '../components/ChannelTile';
import { CHANNELS } from '../data/channels';
import {
  HERO_ITEMS,
  CONTINUE_WATCHING,
  TRENDING,
  MOST_WATCHED,
  NEW_RELEASES,
  SERIES_LIST,
  PROGRAMS_LIST,
  DOCUMENTARIES_LIST,
  KIDS_LIST,
  RECOMMENDED,
} from '../data/catalog';
import './HomePage.css';

export default function HomePage() {
  const { t } = useI18n();

  const progressMap = useMemo(
    () => Object.fromEntries(CONTINUE_WATCHING.map((item) => [item.id, item.progress])),
    []
  );

  return (
    <div>
      <HeroBanner items={HERO_ITEMS} />
      <div className="rails-stack">
        <FeaturedCarousel title={t('home.featuredOriginals')} items={TRENDING} seeAllHref="/search?filter=trending" />
        <section className="channels-row container">
          <h2 className="channels-row__title">{t('home.channels')}</h2>
          <div className="channels-row__grid">
            {CHANNELS.map((channel) => (
              <ChannelTile key={channel.id} channel={channel} />
            ))}
          </div>
        </section>
        <ContentRail title={t('home.continueWatching')} items={CONTINUE_WATCHING} progressMap={progressMap} />
        <ContentRail title={t('home.trending')} items={TRENDING} seeAllHref="/search?filter=trending" />
        <ContentRail title={t('home.mostWatched')} items={MOST_WATCHED} seeAllHref="/search?filter=mostWatched" />
        <ContentRail title={t('home.newReleases')} items={NEW_RELEASES} seeAllHref="/search?filter=newRelease" />
        <ContentRail title={t('home.series')} items={SERIES_LIST} seeAllHref="/search?type=series" />
        <ContentRail title={t('home.programs')} items={PROGRAMS_LIST} seeAllHref="/search?type=program" />
        <ContentRail title={t('home.documentaries')} items={DOCUMENTARIES_LIST} seeAllHref="/search?type=documentary" />
        <ContentRail title={t('home.kids')} items={KIDS_LIST} seeAllHref="/search?type=kids" />
        <ContentRail title={t('home.recommended')} items={RECOMMENDED} seeAllHref="/search?filter=recommended" />
      </div>
    </div>
  );
}
