import realThumbnails from './realThumbnails.json';

// Real poster art pulled from Tabie's own live site (tabie.net) — see realThumbnails.json.
// Titles that match an actual Tabie show get their real poster; everything else cycles
// through the same pool so the catalog reads as genuinely photographic, not generated.
let thumbPoolIndex = 0;
function nextRealThumbnail() {
  const entry = realThumbnails[thumbPoolIndex % realThumbnails.length];
  thumbPoolIndex += 1;
  return `/thumbnails/${entry.file}`;
}

const REAL_TITLE_TO_FILE = new Map(realThumbnails.map((t) => [t.title, t.file]));
function realThumbnailFor(exactArabicTitle) {
  const file = REAL_TITLE_TO_FILE.get(exactArabicTitle);
  return file ? `/thumbnails/${file}` : null;
}

const RATINGS = ['G', 'PG', '13+', '16+', '18+'];

const CAST_EN = ['Sara Al-Kaabi', 'Yousef Al-Mansoori', 'Noor Al-Hashimi', 'Faisal Al-Marri', 'Layla Hassan', 'Omar Al-Suwaidi', 'Maryam Nasser', 'Khalid Al-Dosari'];
const CAST_AR = ['سارة الكعبي', 'يوسف المنصوري', 'نور الهاشمي', 'فيصل المري', 'ليلى حسن', 'عمر السويدي', 'مريم ناصر', 'خالد الدوسري'];

function pickCast(seed) {
  const start = seed % CAST_EN.length;
  return {
    en: [CAST_EN[start], CAST_EN[(start + 1) % CAST_EN.length], CAST_EN[(start + 2) % CAST_EN.length]],
    ar: [CAST_AR[start], CAST_AR[(start + 1) % CAST_AR.length], CAST_AR[(start + 2) % CAST_AR.length]],
  };
}

let uid = 0;
const typeCounters = {};
function nextId(prefix) {
  uid += 1;
  typeCounters[prefix] = (typeCounters[prefix] || 0) + 1;
  return `${prefix}-${String(typeCounters[prefix]).padStart(3, '0')}`;
}

function buildItem({ type, titleEn, titleAr, synopsisEn, synopsisAr, genres, year, duration, seasons, episodes, tags = [], realTitleMatch }) {
  const id = nextId(type);
  const seedNum = uid;
  const art = (realTitleMatch && realThumbnailFor(realTitleMatch)) || nextRealThumbnail();
  return {
    id,
    type,
    title: { en: titleEn, ar: titleAr },
    synopsis: { en: synopsisEn, ar: synopsisAr },
    genres,
    year,
    duration,
    seasons,
    episodes,
    rating: RATINGS[seedNum % RATINGS.length],
    cast: pickCast(seedNum),
    director: { en: CAST_EN[(seedNum + 3) % CAST_EN.length], ar: CAST_AR[(seedNum + 3) % CAST_AR.length] },
    poster: art,
    backdrop: art,
    tags,
  };
}

// --- Authentic-flavored anchor titles, echoing Tabie's own brand showcase content ---
const ANCHOR_ITEMS = [
  buildItem({
    type: 'series',
    titleEn: 'Relief After Hardship',
    titleAr: 'الفرج بعد الشدّة',
    synopsisEn: 'A sweeping family saga following three generations of a Gulf family as they rebuild after loss — a story of patience, faith, and the relief that follows hardship.',
    synopsisAr: 'ملحمة عائلية تمتد عبر ثلاثة أجيال من عائلة خليجية تعيد بناء حياتها بعد الفقد، في قصة عن الصبر والإيمان والفرج الذي يعقب الشدّة.',
    genres: ['drama', 'family'],
    year: 2026,
    seasons: 2,
    episodes: 24,
    tags: ['hero', 'trending', 'original'],
    realTitleMatch: 'الفرج بعد الشدة',
  }),
  buildItem({
    type: 'series',
    titleEn: 'Heroes of the Sands',
    titleAr: 'أبطال الرمال',
    synopsisEn: 'A young warrior rises to defend his people in a desert kingdom on the brink of change, in this sweeping period drama shot across the Gulf.',
    synopsisAr: 'شاب مقاتل ينهض للدفاع عن قومه في مملكة صحراوية على أعتاب التغيير، في عمل درامي تاريخي ملحمي صُوّر في أنحاء الخليج.',
    genres: ['drama', 'history', 'action'],
    year: 2025,
    seasons: 1,
    episodes: 16,
    tags: ['hero', 'trending', 'newRelease'],
    realTitleMatch: 'أبطال الرمال',
  }),
  buildItem({
    type: 'program',
    titleEn: 'Tabie Kitchen',
    titleAr: 'مطبخ تابع',
    synopsisEn: 'Celebrated Gulf chefs share family recipes passed down through generations, cooked live in a warm studio kitchen.',
    synopsisAr: 'نخبة من أشهر الطهاة الخليجيين يشاركون وصفات عائلية توارثتها الأجيال، ويطهونها مباشرة في استديو دافئ.',
    genres: ['cooking', 'family'],
    year: 2026,
    seasons: 3,
    episodes: 40,
    tags: ['mostWatched'],
  }),
  buildItem({
    type: 'documentary',
    titleEn: 'Story of a Song',
    titleAr: 'قصة أغنية',
    synopsisEn: 'The untold stories behind the region’s most iconic songs, told by the composers, poets, and singers who created them.',
    synopsisAr: 'حكايات لم تُروَ من قبل خلف أشهر الأغاني في المنطقة، يرويها الملحنون والشعراء والمطربون الذين صنعوها.',
    genres: ['music', 'documentary'],
    year: 2025,
    duration: 52,
    tags: ['recommended'],
  }),
  buildItem({
    type: 'series',
    titleEn: 'Scholars Abroad',
    titleAr: 'مبتعثون',
    synopsisEn: 'Four Qatari students chase their dreams on scholarship in Paris, balancing ambition, homesickness, and self-discovery.',
    synopsisAr: 'أربعة طلاب قطريين يلاحقون أحلامهم في بعثة دراسية في باريس، بين الطموح والحنين إلى الوطن واكتشاف الذات.',
    genres: ['drama', 'comedy'],
    year: 2026,
    seasons: 1,
    episodes: 12,
    tags: ['newRelease', 'trending'],
  }),
  buildItem({
    type: 'series',
    titleEn: 'The Tower',
    titleAr: 'بنيان',
    synopsisEn: 'Rival architects and developers race to reshape the skyline of a rising Gulf city — where every tower hides a secret.',
    synopsisAr: 'مهندسون ومطورون متنافسون يتسابقون لإعادة تشكيل أفق مدينة خليجية صاعدة، حيث يخفي كل برج سرًا.',
    genres: ['drama', 'thriller'],
    year: 2025,
    seasons: 1,
    episodes: 20,
    tags: ['mostWatched'],
  }),
];

// --- Word banks for generated bilingual titles (deterministic, on-brand filler volume) ---
const NOUNS_EN = ['Shadow', 'Echo', 'Mirage', 'Pulse', 'Passage', 'Promise', 'Ember', 'Compass', 'Horizon', 'Whisper', 'Legacy', 'Harbor'];
const NOUNS_AR = ['ظل', 'صدى', 'سراب', 'نبض', 'ممر', 'وعد', 'جمرة', 'بوصلة', 'أفق', 'همسة', 'إرث', 'مرفأ'];
const PLACES_EN = ['the Desert', 'the Sea', 'the Old City', 'Tomorrow', 'the Coast', 'Home', 'the North Wind', 'the Harvest', 'Ramadan', 'the Corniche'];
const PLACES_AR = ['الصحراء', 'البحر', 'المدينة القديمة', 'الغد', 'الساحل', 'الديرة', 'الشمال', 'الحصاد', 'رمضان', 'الكورنيش'];

const SYNOPSIS_EN = [
  'A gripping story of ambition and family loyalty set against the backdrop of a changing Gulf.',
  'Secrets from the past resurface to test the bonds of an unlikely friendship.',
  'A tale of love, rivalry, and redemption spanning two decades.',
  'One family, one house, and the choices that will define the next generation.',
  'A determined outsider upends an old order, and nothing in town stays the same.',
  'Two rivals are forced together by circumstance — and slowly, reluctantly, by respect.',
  'A homecoming stirs up questions nobody in the family wanted answered.',
  'When the truth finally surfaces, every relationship in its path has to be renegotiated.',
];
const SYNOPSIS_AR = [
  'قصة آسرة عن الطموح والولاء العائلي على خلفية خليج متغيّر.',
  'أسرار من الماضي تعود لتختبر أواصر صداقة غير متوقعة.',
  'حكاية حب وتنافس وخلاص تمتد عبر عقدين من الزمن.',
  'عائلة واحدة، بيت واحد، وخيارات ستحدد مصير الجيل القادم.',
  'غريب عازم على التغيير يقلب نظامًا قديمًا رأسًا على عقب.',
  'خصمان تجمعهما الظروف رغمًا عنهما، ليكتشفا احترامًا لم يتوقعاه.',
  'عودة إلى الديار تثير أسئلة لم يكن أحد في العائلة يريد إجابتها.',
  'حين تنكشف الحقيقة أخيرًا، تتغيّر كل علاقة كانت في طريقها.',
];

function generateFiller(count, type, genrePool, opts = {}) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    const n = (uid + i * 7) % NOUNS_EN.length;
    const p = (uid + i * 3) % PLACES_EN.length;
    const s = (uid + i * 5) % SYNOPSIS_EN.length;
    const genres = [genrePool[i % genrePool.length], genrePool[(i + 1) % genrePool.length]];
    items.push(
      buildItem({
        type,
        titleEn: `${NOUNS_EN[n]} of ${PLACES_EN[p]}`,
        titleAr: `${NOUNS_AR[n]} ${PLACES_AR[p]}`,
        synopsisEn: SYNOPSIS_EN[s],
        synopsisAr: SYNOPSIS_AR[s],
        genres,
        year: 2020 + ((uid + i) % 6),
        duration: type === 'movie' || type === 'documentary' ? 85 + ((uid + i * 11) % 55) : undefined,
        seasons: type === 'series' ? 1 + ((uid + i) % 3) : undefined,
        episodes: type === 'series' ? 8 + ((uid + i * 2) % 16) : undefined,
        tags: opts.tags ? opts.tags(i) : [],
      })
    );
  }
  return items;
}

// Filler volumes are generous enough that every tagged rail (Trending, Most Watched,
// New Releases) still has plenty of cards to scroll through on very wide/ultrawide
// screens instead of trailing off into empty space after 4-5 items.
const MOVIES = generateFiller(24, 'movie', ['drama', 'action', 'thriller', 'romance', 'comedy'], {
  tags: (i) => (i < 10 ? ['newRelease'] : i < 18 ? ['trending'] : ['mostWatched']),
});
const SERIES = [...ANCHOR_ITEMS.filter((i) => i.type === 'series'), ...generateFiller(20, 'series', ['drama', 'comedy', 'family', 'thriller'], {
  tags: (i) => (i < 10 ? ['mostWatched'] : i < 14 ? ['newRelease'] : ['trending']),
})];
const PROGRAMS = [...ANCHOR_ITEMS.filter((i) => i.type === 'program'), ...generateFiller(18, 'program', ['talk', 'cooking', 'reality', 'sports'], {
  tags: (i) => (i < 8 ? ['trending'] : []),
})];
const DOCUMENTARIES = [...ANCHOR_ITEMS.filter((i) => i.type === 'documentary'), ...generateFiller(18, 'documentary', ['documentary', 'history', 'music'], {})];
const KIDS = generateFiller(20, 'kids', ['kids', 'family', 'comedy'], {}).map((item) => ({ ...item, rating: 'G' }));

export const CATALOG = [...ANCHOR_ITEMS, ...MOVIES, ...SERIES.filter((i) => !ANCHOR_ITEMS.includes(i)), ...PROGRAMS.filter((i) => !ANCHOR_ITEMS.includes(i)), ...DOCUMENTARIES.filter((i) => !ANCHOR_ITEMS.includes(i)), ...KIDS];

export const HERO_ITEMS = ANCHOR_ITEMS.filter((i) => i.tags.includes('hero'));
export const TRENDING = CATALOG.filter((i) => i.tags.includes('trending'));
export const MOST_WATCHED = CATALOG.filter((i) => i.tags.includes('mostWatched'));
export const NEW_RELEASES = CATALOG.filter((i) => i.tags.includes('newRelease'));
const recommendedTagged = CATALOG.filter((i) => i.tags.includes('recommended'));
const recommendedIds = new Set(recommendedTagged.map((i) => i.id));
export const RECOMMENDED = recommendedTagged.concat(CATALOG.filter((i) => !recommendedIds.has(i.id)).slice(0, 12));
export const SERIES_LIST = CATALOG.filter((i) => i.type === 'series');
export const PROGRAMS_LIST = CATALOG.filter((i) => i.type === 'program');
export const DOCUMENTARIES_LIST = CATALOG.filter((i) => i.type === 'documentary');
export const KIDS_LIST = CATALOG.filter((i) => i.type === 'kids');
export const MOVIES_LIST = CATALOG.filter((i) => i.type === 'movie');

export const CONTINUE_WATCHING = [
  { ...CATALOG[0], progress: 62 },
  { ...CATALOG[4], progress: 28 },
  { ...CATALOG[9], progress: 85 },
  { ...CATALOG[14], progress: 12 },
  { ...CATALOG[20], progress: 47 },
];

export function findById(id) {
  return CATALOG.find((item) => item.id === id);
}

export function getRelated(item, count = 12) {
  return CATALOG.filter((c) => c.id !== item.id && c.genres.some((g) => item.genres.includes(g))).slice(0, count);
}

export function buildEpisodes(item, season = 1) {
  if (!item.seasons || !item.episodes) return [];
  const perSeason = Math.max(4, Math.round(item.episodes / item.seasons));
  return Array.from({ length: perSeason }).map((_, i) => {
    const epNum = i + 1;
    const seed = `${item.id}-s${season}-e${epNum}`;
    return {
      id: seed,
      number: epNum,
      title: {
        en: `Episode ${epNum}`,
        ar: `الحلقة ${epNum}`,
      },
      duration: 38 + ((epNum * 7) % 20),
      // Reuse the show's own key art rather than a random real photo — a different,
      // unrelated title's photo (and baked-in logotype) per episode reads as broken, not varied.
      thumbnail: item.backdrop,
      synopsis: item.synopsis,
    };
  });
}

export function searchCatalog(query, lang) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CATALOG.filter((item) => item.title[lang].toLowerCase().includes(q) || item.title.en.toLowerCase().includes(q));
}
