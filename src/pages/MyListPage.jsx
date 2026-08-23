import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useAppState } from '../context/AppStateContext';
import Button from '../components/Button';
import ContentCard from '../components/ContentCard';
import EmptyState from '../components/EmptyState';
import { ListIcon } from '../components/icons';
import './MyListPage.css';

export default function MyListPage() {
  const { t } = useI18n();
  const { myList } = useAppState();

  return (
    <div className="my-list-page container">
      <div className="my-list-page__head">
        <h1>{t('myList.title')}</h1>
        {myList.length > 0 && (
          <span className="my-list-page__count">
            {myList.length} {t('myList.itemsCount')}
          </span>
        )}
      </div>

      {myList.length === 0 ? (
        <EmptyState
          icon={<ListIcon width={30} height={30} />}
          title={t('myList.empty')}
          hint={t('myList.emptyHint')}
          action={
            <Button as={Link} to="/" variant="primary">
              {t('myList.browse')}
            </Button>
          }
        />
      ) : (
        <div className="my-list-page__grid">
          {myList.map((item) => (
            <ContentCard key={item.id} item={item} removable />
          ))}
        </div>
      )}
    </div>
  );
}
