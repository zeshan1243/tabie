import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useAppState, THEMES } from '../context/AppStateContext';
import { CURRENT_USER } from '../data/profile';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import './ProfilePage.css';

// The swatch trio previews each theme's page / rail / card surfaces, so the choice
// is legible before it is applied. Kept in sync with :root[data-theme] in theme.css.
const THEME_SWATCHES = {
  midnight: ['#05081a', '#0f1533', '#1b2350'],
  'brand-navy': ['#03175e', '#0a2582', '#193bac'],
};
const THEME_LABEL_KEY = { midnight: 'themeMidnight', 'brand-navy': 'themeBrandNavy' };

export default function ProfilePage() {
  const { t } = useI18n();
  const { settings, updateSetting } = useAppState();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const name = CURRENT_USER.nameAr;

  return (
    <div className="profile-page container">
      <h1 className="profile-page__heading">{t('profile.title')}</h1>

      <section className="profile-section profile-section--account">
        <img src={CURRENT_USER.avatar} alt="" className="profile-page__avatar" />
        <div>
          <p className="profile-page__name">{name}</p>
          <p className="profile-page__email">{CURRENT_USER.email}</p>
          <Badge tone="gold">{t('profile.planName')}</Badge>
        </div>
      </section>

      <section className="profile-section">
        <h2>{t('profile.appearance')}</h2>
        <p className="profile-section__hint">{t('profile.themeHint')}</p>
        <div className="theme-picker" role="radiogroup" aria-label={t('profile.theme')}>
          {THEMES.map((id) => {
            const selected = settings.theme === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`theme-option${selected ? ' theme-option--selected' : ''}`}
                onClick={() => updateSetting('theme', id)}
              >
                <span className="theme-option__swatches" aria-hidden="true">
                  {THEME_SWATCHES[id].map((c) => (
                    <span key={c} className="theme-option__swatch" style={{ background: c }} />
                  ))}
                </span>
                <span className="theme-option__name">{t(`profile.${THEME_LABEL_KEY[id]}`)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <Button variant="outline" size="md" onClick={() => setLogoutOpen(true)}>
        {t('profile.logout')}
      </Button>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title={t('profile.logout')}
        actions={
          <>
            <Button variant="ghost" onClick={() => setLogoutOpen(false)}>
              {t('profile.cancel')}
            </Button>
            <Button variant="danger" onClick={() => setLogoutOpen(false)}>
              {t('profile.logout')}
            </Button>
          </>
        }
      >
        {t('profile.logoutConfirm')}
      </Modal>
    </div>
  );
}
