import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { CATALOG } from '../data/catalog';

const LIST_KEY = 'tabie:myList';
const SETTINGS_KEY = 'tabie:settings';

const DEFAULT_SETTINGS = {
  autoplayNext: true,
  autoplayPreviews: true,
  defaultQuality: 'auto',
  subtitleLanguage: 'en',
  notifyNewEpisodes: true,
  notifyRecommendations: false,
};

function loadList() {
  try {
    const raw = window.localStorage.getItem(LIST_KEY);
    return raw ? JSON.parse(raw) : ['series-001', 'movie-002', 'documentary-001'];
  } catch {
    return [];
  }
}

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [myListIds, setMyListIds] = useState(loadList);
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    window.localStorage.setItem(LIST_KEY, JSON.stringify(myListIds));
  }, [myListIds]);

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const isInList = useCallback((id) => myListIds.includes(id), [myListIds]);

  const toggleList = useCallback((id) => {
    setMyListIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const removeFromList = useCallback((id) => {
    setMyListIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const myList = useMemo(
    () => myListIds.map((id) => CATALOG.find((item) => item.id === id)).filter(Boolean),
    [myListIds]
  );

  const value = useMemo(
    () => ({ myList, isInList, toggleList, removeFromList, settings, updateSetting }),
    [myList, isInList, toggleList, removeFromList, settings, updateSetting]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
