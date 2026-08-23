import realThumbnails from './realThumbnails.json';
import aljazeeraLogo from '../assets/channels/aljazeera-tv.png';
import alkassLogo from '../assets/channels/alkass-tv.png';
import alrayyanLogo from '../assets/channels/alrayyan-tv.png';
import beinLogo from '../assets/channels/bein-tv.png';
import qatarTvLogo from '../assets/channels/q-tv.png';
import qatarTv2Logo from '../assets/channels/q-tv2.png';

// Offset into the real-thumbnail pool so channel art doesn't repeat the catalog's picks.
const CHANNEL_THUMB_OFFSET = 60;

const CHANNEL_DEFS = [
  { id: 'ch-qatar-tv', en: 'Qatar TV', ar: 'قطر', logo: qatarTvLogo },
  { id: 'ch-qatar-tv2', en: 'Qatar TV 2', ar: 'قطر 2', logo: qatarTv2Logo },
  { id: 'ch-aljazeera', en: 'Al Jazeera', ar: 'الجزيرة', logo: aljazeeraLogo },
  { id: 'ch-alrayyan', en: 'Al Rayyan', ar: 'الريان', logo: alrayyanLogo },
  { id: 'ch-beinsports', en: 'beIN Sports', ar: 'بي إن سبورتس', logo: beinLogo },
  { id: 'ch-alkass', en: 'Al Kass', ar: 'الكأس', logo: alkassLogo },
];

const PROGRAM_BLOCKS = [
  { en: 'Morning Majlis', ar: 'مجلس الصباح' },
  { en: 'Relief After Hardship', ar: 'الفرج بعد الشدّة' },
  { en: 'Tabie Kitchen', ar: 'مطبخ تابع' },
  { en: 'Midday News', ar: 'نشرة الظهيرة' },
  { en: 'Heroes of the Sands', ar: 'أبطال الرمال' },
  { en: 'Story of a Song', ar: 'قصة أغنية' },
  { en: 'Prime Drama Hour', ar: 'ساعة الدراما' },
  { en: 'Evening Bulletin', ar: 'نشرة المساء' },
  { en: 'Scholars Abroad', ar: 'مبتعثون' },
  { en: 'Late Night Talk', ar: 'حوار منتصف الليل' },
];

function buildSchedule(offset) {
  const slots = [];
  for (let h = 6; h <= 23; h += 2) {
    const block = PROGRAM_BLOCKS[(h / 2 + offset) % PROGRAM_BLOCKS.length];
    slots.push({
      time: `${String(h).padStart(2, '0')}:00`,
      title: block,
    });
  }
  return slots;
}

export const CHANNELS = CHANNEL_DEFS.map((ch, idx) => {
  const schedule = buildSchedule(idx);
  const nowIndex = 3 + idx;
  return {
    id: ch.id,
    name: { en: ch.en, ar: ch.ar },
    logo: ch.logo,
    thumbnail: `/thumbnails/${realThumbnails[(CHANNEL_THUMB_OFFSET + idx) % realThumbnails.length].file}`,
    schedule,
    nowPlaying: schedule[nowIndex % schedule.length],
    upNext: schedule[(nowIndex + 1) % schedule.length],
    progress: 20 + ((idx * 17) % 60),
  };
});

export function findChannel(id) {
  return CHANNELS.find((c) => c.id === id);
}
