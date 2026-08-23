// Deterministic, dependency-free "poster art" generator.
// Produces an abstract brand-textured SVG (no network image dependency) so every
// mock title gets a consistent, on-brand visual without baking localized text
// into the image itself — real titles are rendered as HTML for easy i18n.

const PALETTES = [
  ['#03175e', '#5e20d8'],
  ['#331698', '#23d6c3'],
  ['#03175e', '#23d6c3'],
  ['#031047', '#5e20d8'],
  ['#0f1533', '#331698'],
  ['#5e20d8', '#03175e'],
  ['#03175e', '#331698'],
  ['#0a1230', '#23d6c3'],
];

const SIZES = {
  poster: { w: 300, h: 450 },
  backdrop: { w: 960, h: 540 },
  square: { w: 320, h: 320 },
  wide: { w: 640, h: 360 },
};

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getArt(seed, kind = 'poster') {
  const { w, h } = SIZES[kind] || SIZES.poster;
  const hash = hashString(String(seed));
  const [c1, c2] = PALETTES[hash % PALETTES.length];
  const angle = (hash % 4) * 45;
  const showDots = hash % 3 !== 0;
  const showQuarter = hash % 2 === 0;
  const dotColor = hash % 2 === 0 ? '#febb00' : '#23d6c3';
  const quarterColor = hash % 3 === 0 ? '#febb00' : '#23d6c3';
  const flipQuarter = hash % 5 < 2;

  const dotsGroup = showDots
    ? Array.from({ length: 12 })
        .map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const cx = w * 0.08 + col * (w * 0.045);
          const cy = h * 0.08 + row * (h * 0.03);
          return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(w * 0.008).toFixed(1)}" fill="${dotColor}" opacity="0.55" />`;
        })
        .join('')
    : '';

  const quarterX = flipQuarter ? w * 0.78 : -w * 0.08;
  const quarterY = flipQuarter ? -h * 0.06 : h * 0.82;
  const quarterR = w * 0.32;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <rect width="${w}" height="${h}" fill="url(#glow)" />
  ${showQuarter ? `<path d="M ${quarterX} ${quarterY} h ${quarterR} a ${quarterR} ${quarterR} 0 0 1 -${quarterR} ${quarterR} z" fill="${quarterColor}" opacity="0.18" />` : ''}
  ${dotsGroup}
  <circle cx="${w * 0.78}" cy="${h * 0.24}" r="${Math.min(w, h) * 0.1}" fill="#ffffff" opacity="0.05" />
  <path d="M ${w * 0.78 - 7} ${h * 0.24 - 11} L ${w * 0.78 + 11} ${h * 0.24} L ${w * 0.78 - 7} ${h * 0.24 + 11} Z" fill="#ffffff" opacity="0.1" />
  <rect width="${w}" height="${h}" fill="#03081a" opacity="0.06" />
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getAvatarArt(seed) {
  const hash = hashString(String(seed));
  const [c1, c2] = PALETTES[hash % PALETTES.length];
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="80" fill="url(#g)" />
  <circle cx="80" cy="64" r="26" fill="#ffffff" opacity="0.85" />
  <path d="M30 140 C30 105 130 105 130 140 Z" fill="#ffffff" opacity="0.85" />
</svg>`.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
