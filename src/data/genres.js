export const GENRES = [
  { id: 'drama', en: 'Drama', ar: 'دراما' },
  { id: 'comedy', en: 'Comedy', ar: 'كوميديا' },
  { id: 'action', en: 'Action', ar: 'أكشن' },
  { id: 'family', en: 'Family', ar: 'عائلي' },
  { id: 'documentary', en: 'Documentary', ar: 'وثائقي' },
  { id: 'music', en: 'Music', ar: 'موسيقى' },
  { id: 'cooking', en: 'Cooking', ar: 'طبخ' },
  { id: 'kids', en: 'Kids', ar: 'أطفال' },
  { id: 'reality', en: 'Reality', ar: 'واقعي' },
  { id: 'history', en: 'History', ar: 'تاريخي' },
  { id: 'sports', en: 'Sports', ar: 'رياضة' },
  { id: 'thriller', en: 'Thriller', ar: 'إثارة' },
  { id: 'romance', en: 'Romance', ar: 'رومانسي' },
  { id: 'talk', en: 'Talk Show', ar: 'برنامج حواري' },
];

export function genreLabel(id, lang) {
  const g = GENRES.find((item) => item.id === id);
  if (!g) return id;
  return lang === 'ar' ? g.ar : g.en;
}
