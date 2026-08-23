import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CATALOG, TRENDING } from '../data/catalog';
import { GENRES, genreLabel } from '../data/genres';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import ContentCard from '../components/ContentCard';
import EmptyState from '../components/EmptyState';
import { SearchIcon, ClockIcon } from '../components/icons';
import './SearchPage.css';

export default function SearchPage() {
  const { t, lang } = useI18n();
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState(params.get('genre') || null);
  const [typeFilter, setTypeFilter] = useState(params.get('type') || 'all');
  const [tagFilter, setTagFilter] = useState(params.get('filter') || null);
  const [recent, setRecent] = useLocalStorage('tabie:recentSearches', []);
  const debounced = useDebouncedValue(query, 300);

  // The sidebar links (Movies/Series/Sports) all point at this same route with
  // different query strings, so the component stays mounted between them — resync
  // local filter state whenever the URL's own params change.
  useEffect(() => {
    setGenreFilter(params.get('genre') || null);
    setTypeFilter(params.get('type') || 'all');
    setTagFilter(params.get('filter') || null);
    setQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (!debounced.trim()) return;
    setRecent((prev) => [debounced, ...prev.filter((r) => r.toLowerCase() !== debounced.toLowerCase())].slice(0, 8));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const handleQueryChange = (value) => {
    setQuery(value);
    if (value) setGenreFilter(null);
  };

  const handleGenreClick = (genreId) => {
    setGenreFilter(genreId);
    setQuery('');
  };

  const typeOptions = [
    { id: 'all', label: t('search.allTypes') },
    { id: 'movie', label: t('search.movies') },
    { id: 'series', label: t('search.series') },
    { id: 'documentary', label: t('search.documentaries') },
    { id: 'program', label: t('search.programs') },
    { id: 'kids', label: t('search.kids') },
  ];

  const isActive = Boolean(debounced.trim()) || Boolean(genreFilter) || Boolean(tagFilter) || typeFilter !== 'all';

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    let pool = CATALOG;
    if (genreFilter) {
      pool = pool.filter((item) => item.genres.includes(genreFilter));
    } else if (tagFilter) {
      pool = pool.filter((item) => item.tags?.includes(tagFilter));
    } else if (q) {
      pool = pool.filter((item) => item.title.en.toLowerCase().includes(q) || item.title.ar.includes(debounced.trim()));
    }
    if (typeFilter !== 'all') {
      pool = pool.filter((item) => item.type === typeFilter);
    }
    return pool;
  }, [debounced, genreFilter, tagFilter, typeFilter]);

  const activeTypeOption = typeOptions.find((opt) => opt.id === typeFilter);
  const activeLabel = genreFilter ? genreLabel(genreFilter, lang) : debounced.trim() || activeTypeOption?.label || '';

  return (
    <div className="search-page container">
      <SearchBar value={query} onChange={handleQueryChange} placeholder={t('search.placeholder')} />

      {isActive && <FilterChips options={typeOptions} value={typeFilter} onChange={setTypeFilter} />}

      {!isActive ? (
        <div className="search-browse">
          {recent.length > 0 && (
            <section className="search-section">
              <div className="search-section__head">
                <h2>{t('search.recent')}</h2>
                <button type="button" className="search-clear" onClick={() => setRecent([])}>
                  {t('search.clearRecent')}
                </button>
              </div>
              <div className="search-recent-chips">
                {recent.map((term) => (
                  <button key={term} type="button" className="search-recent-chip" onClick={() => handleQueryChange(term)}>
                    <ClockIcon width={14} height={14} />
                    {term}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="search-section">
            <h2>{t('search.categories')}</h2>
            <div className="search-genre-grid">
              {GENRES.map((g) => (
                <button key={g.id} type="button" className="search-genre-tile" onClick={() => handleGenreClick(g.id)}>
                  {genreLabel(g.id, lang)}
                </button>
              ))}
            </div>
          </section>

          <section className="search-section">
            <h2>{t('search.popular')}</h2>
            <div className="search-grid">
              {TRENDING.slice(0, 10).map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      ) : results.length > 0 ? (
        <>
          <p className="search-results-count">
            {t('search.resultsFor')} “{activeLabel}” · {results.length}
          </p>
          <div className="search-grid">
            {results.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState icon={<SearchIcon width={30} height={30} />} title={t('search.noResults')} hint={t('search.noResultsHint')} />
      )}
    </div>
  );
}
