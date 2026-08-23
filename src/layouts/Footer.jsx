import Logo from '../components/Logo';
import { useI18n } from '../i18n/I18nContext';
import './Footer.css';

export default function Footer() {
  const { t } = useI18n();
  const year = 2026;
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <Logo size="sm" />
        <p className="footer__tagline">{t('footer.tagline')}</p>
        <p className="footer__meta">
          © {year} {t('footer.company')} · {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
