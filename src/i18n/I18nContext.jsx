import { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { translations } from './translations';

const LANG = 'ar';
const DIR = 'rtl';

const I18nContext = createContext(null);

function resolve(dict, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
}

export function I18nProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute('lang', LANG);
    document.documentElement.setAttribute('dir', DIR);
  }, []);

  const t = useCallback((key, fallback) => {
    const value = resolve(translations[LANG], key) ?? resolve(translations.en, key);
    return value ?? fallback ?? key;
  }, []);

  const value = useMemo(() => ({ lang: LANG, dir: DIR, t, isRtl: true }), [t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
