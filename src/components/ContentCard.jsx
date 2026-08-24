import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import { genreLabel } from '../data/genres';
import { TYPE_LABEL_KEY } from '../data/catalog';
import { useLongPress } from '../hooks/useLongPress';
import ProgressBar from './ProgressBar';
import BottomSheet from './BottomSheet';
import { PlayIcon, PlusIcon, CheckIcon, TrashIcon, InfoIcon } from './icons';
import './ContentCard.css';

// captionInside puts the title on the artwork instead of the type label beneath it.
export default function ContentCard({ item, progress, removable = false, captionInside = false }) {
  const { t, lang } = useI18n();
  const { isInList, toggleList, removeFromList } = useAppState();
  const [sheetOpen, setSheetOpen] = useState(false);
  const saved = isInList(item.id);
  const detailsHref = `/title/${item.id}`;

  // Touch has no hover, so the desktop reveal-on-hover panel is unreachable there — a
  // long press opens the same details in a bottom sheet instead, Prime Video-style.
  const longPress = useLongPress(() => setSheetOpen(true));
  const closeSheet = () => setSheetOpen(false);

  // One line rather than two: the info now sits over the artwork, so every line it does
  // not need is artwork it does not cover. Rating stays a pill beside it.
  const metaLine = [
    item.year,
    item.seasons ? `${item.seasons} ${item.seasons === 1 ? t('details.season') : t('common.seasons')}` : item.duration ? `${item.duration} ${t('common.minutes')}` : null,
    item.genres.slice(0, 2).map((g) => genreLabel(g, lang)).join(' · '),
  ]
    .filter(Boolean)
    .join(' • ');

  const metaRow = (
    <div className="content-card__meta-row">
      {item.rating && <span className="content-card__pill content-card__pill--outline">{item.rating}</span>}
      <span className="content-card__metadata">{metaLine}</span>
      {item.tags?.includes('newRelease') && <span className="content-card__pill content-card__pill--gold">{t('common.new')}</span>}
    </div>
  );

  const actions = (
    <div className="content-card__actions">
      <Link to={`/watch/${item.id}`} className="content-card__action is-primary" aria-label={t('common.play')} onClick={closeSheet}>
        <PlayIcon width={13} height={13} />
        <span>{t('common.watchNow')}</span>
      </Link>
      {removable ? (
        <button
          type="button"
          className="content-card__action content-card__action--danger"
          onClick={() => {
            removeFromList(item.id);
            closeSheet();
          }}
          aria-label={t('common.removeFromList')}
        >
          <TrashIcon width={14} height={14} />
        </button>
      ) : (
        <button
          type="button"
          className={`content-card__action ${saved ? 'is-active' : ''}`}
          onClick={() => toggleList(item.id)}
          aria-pressed={saved}
          aria-label={saved ? t('common.removeFromList') : t('common.addToList')}
        >
          {saved ? <CheckIcon width={14} height={14} /> : <PlusIcon width={14} height={14} />}
        </button>
      )}
      <Link to={detailsHref} className="content-card__action" aria-label={t('common.moreInfo')} onClick={closeSheet}>
        <InfoIcon width={14} height={14} />
      </Link>
    </div>
  );

  return (
    <div
      className={`content-card${captionInside ? ' content-card--caption-inside' : ''}`}
      onPointerDown={longPress.onPointerDown}
      onPointerMove={longPress.onPointerMove}
      onPointerUp={longPress.onPointerUp}
      onPointerCancel={longPress.onPointerCancel}
      onClickCapture={longPress.onClickCapture}
    >
      {/* The slot holds the artwork's ratio and never changes size. __frame grows out of it
          on hover — wider and taller — so a hovered card reflows nothing around it. */}
      <div className="content-card__slot">
        <div className="content-card__frame">
          <Link to={detailsHref} className="content-card__media" aria-label={item.title[lang]}>
            {/* draggable=false so a drag across the row scrolls the rail (see ContentRail)
                instead of starting the browser's native image drag. */}
            <img src={item.backdrop} alt="" loading="lazy" draggable="false" />
            <div className="content-card__overlay" />
            {typeof progress === 'number' && (
              <div className="content-card__progress">
                <ProgressBar value={progress} />
              </div>
            )}
          </Link>

          {captionInside && <p className="content-card__caption">{item.title[lang]}</p>}

          <div className="content-card__info">
            <p className="content-card__title">{item.title[lang]}</p>
            {metaRow}
            <p className="content-card__description line-clamp-2">{item.synopsis[lang]}</p>
            {actions}
          </div>
        </div>
      </div>

      {/* Resting caption, outside the artwork so the frame's overflow clip cannot reach it.
          A link of its own rather than part of the media link above, kept out of the tab
          order so it does not become a second stop for the same destination. The
          caption-inside variant carries its title on the artwork instead. */}
      {!captionInside && (
        <Link to={detailsHref} className="content-card__label" tabIndex={-1} aria-hidden="true">
          {t(TYPE_LABEL_KEY[item.type] || 'search.movies')}
        </Link>
      )}

      <BottomSheet open={sheetOpen} onClose={closeSheet}>
        <div className="card-sheet">
          <div className="card-sheet__media">
            <img src={item.backdrop} alt="" />
          </div>
          <p className="card-sheet__title">{item.title[lang]}</p>
          {metaRow}
          <p className="card-sheet__description">{item.synopsis[lang]}</p>
          {actions}
        </div>
      </BottomSheet>
    </div>
  );
}
