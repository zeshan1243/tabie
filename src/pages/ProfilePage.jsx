import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import { CURRENT_USER } from '../data/profile';
import Toggle from '../components/Toggle';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import './ProfilePage.css';

const QUALITY_OPTIONS = ['auto', '1080p', '720p', '480p'];
const SUBTITLE_OPTIONS = [
  { id: 'off', en: 'Off', ar: 'إيقاف' },
  { id: 'en', en: 'English', ar: 'الإنجليزية' },
  { id: 'ar', en: 'Arabic', ar: 'العربية' },
];

export default function ProfilePage() {
  const { t, lang } = useI18n();
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
        <h2>{t('profile.playback')}</h2>
        <div className="profile-row">
          <span>{t('profile.autoplay')}</span>
          <Toggle checked={settings.autoplayNext} onChange={(v) => updateSetting('autoplayNext', v)} label={t('profile.autoplay')} />
        </div>
        <div className="profile-row">
          <span>{t('profile.autoplayPreviews')}</span>
          <Toggle checked={settings.autoplayPreviews} onChange={(v) => updateSetting('autoplayPreviews', v)} label={t('profile.autoplayPreviews')} />
        </div>
        <div className="profile-row">
          <span>{t('profile.defaultQuality')}</span>
          <select className="profile-select" value={settings.defaultQuality} onChange={(e) => updateSetting('defaultQuality', e.target.value)}>
            {QUALITY_OPTIONS.map((q) => (
              <option key={q} value={q}>
                {q === 'auto' ? t('player.auto') : q}
              </option>
            ))}
          </select>
        </div>
        <div className="profile-row">
          <span>{t('profile.subtitleLanguage')}</span>
          <select className="profile-select" value={settings.subtitleLanguage} onChange={(e) => updateSetting('subtitleLanguage', e.target.value)}>
            {SUBTITLE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt[lang]}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="profile-section">
        <h2>{t('profile.notifications')}</h2>
        <div className="profile-row">
          <span>{t('profile.notifyNewEpisodes')}</span>
          <Toggle checked={settings.notifyNewEpisodes} onChange={(v) => updateSetting('notifyNewEpisodes', v)} label={t('profile.notifyNewEpisodes')} />
        </div>
        <div className="profile-row">
          <span>{t('profile.notifyRecommendations')}</span>
          <Toggle
            checked={settings.notifyRecommendations}
            onChange={(v) => updateSetting('notifyRecommendations', v)}
            label={t('profile.notifyRecommendations')}
          />
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
