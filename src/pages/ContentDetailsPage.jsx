import { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import { findById, getRelated, buildEpisodes, TYPE_LABEL_KEY } from '../data/catalog';
import { genreLabel } from '../data/genres';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ContentRail from '../components/ContentRail';
import EpisodeRow from '../components/EpisodeRow';
import FilterChips from '../components/FilterChips';
import { PlayIcon, PlusIcon, CheckIcon } from '../components/icons';
import './ContentDetailsPage.css';

export default function ContentDetailsPage() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const { isInList, toggleList } = useAppState();
  const [season, setSeason] = useState(1);

  const item = findById(id);
  const related = useMemo(() => (item ? getRelated(item) : []), [item]);
  const episodes = useMemo(() => (item ? buildEpisodes(item, season) : []), [item, season]);

  if (!item) return <Navigate to="/" replace />;

  const saved = isInList(item.id);
  const seasonOptions = Array.from({ length: item.seasons || 0 }).map((_, i) => ({
    id: String(i + 1),
    label: `${t('details.season')} ${i + 1}`,
  }));

  return (
    <div className="details-page">
      <section className="details-hero" style={{ backgroundImage: `url("${item.backdrop}")` }}>
        <div className="details-hero__scrim" />
        <div className="details-hero__content container">
          <img src={item.poster} alt="" className="details-hero__poster" />
          <div className="details-hero__info">
            <p className="details-hero__type">{t(TYPE_LABEL_KEY[item.type] || 'search.movies')}</p>
            <h1 className="details-hero__title">{item.title[lang]}</h1>

            <div className="details-hero__meta">
              <Badge tone="outline">{item.rating}</Badge>
              <span>{item.year}</span>
              {item.duration && (
                <span>
                  {item.duration} {t('common.minutes')}
                </span>
              )}
              {item.seasons && (
                <span>
                  {item.seasons} {t('common.seasons')}
                </span>
              )}
              <span>{item.genres.map((g) => genreLabel(g, lang)).join(' · ')}</span>
            </div>

            <p className="details-hero__synopsis">{item.synopsis[lang]}</p>

            <div className="details-hero__actions">
              <Button as={Link} to={`/watch/${item.id}`} variant="primary" size="lg" icon={<PlayIcon />}>
                {t('common.watchNow')}
              </Button>
              <Button as={Link} to={`/watch/${item.id}?trailer=1`} variant="outline" size="lg">
                {t('common.trailer')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={saved ? <CheckIcon /> : <PlusIcon />}
                onClick={() => toggleList(item.id)}
                aria-pressed={saved}
              >
                {saved ? t('common.inMyList') : t('common.addToList')}
              </Button>
            </div>

            <dl className="details-hero__credits">
              <div>
                <dt>{t('details.director')}</dt>
                <dd>{item.director[lang]}</dd>
              </div>
              <div>
                <dt>{t('details.cast')}</dt>
                <dd>{item.cast[lang].join(', ')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {item.type === 'series' && episodes.length > 0 && (
        <section className="container details-episodes">
          <div className="details-episodes__head">
            <h2>{t('details.episodesTitle')}</h2>
            {seasonOptions.length > 1 && (
              <FilterChips options={seasonOptions} value={String(season)} onChange={(v) => setSeason(Number(v))} />
            )}
          </div>
          <div className="details-episodes__list">
            {episodes.map((ep) => (
              <EpisodeRow key={ep.id} titleId={item.id} episode={ep} active={ep.number === 1} />
            ))}
          </div>
        </section>
      )}

      <ContentRail title={t('details.related')} items={related} />
    </div>
  );
}
