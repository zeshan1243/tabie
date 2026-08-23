import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { HomeIcon } from '../components/icons';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="container" style={{ paddingBlock: 60 }}>
      <EmptyState
        icon={<HomeIcon width={30} height={30} />}
        title="404"
        hint={t('empty.genericHint')}
        action={
          <Button as={Link} to="/" variant="primary">
            {t('nav.home')}
          </Button>
        }
      />
    </div>
  );
}
