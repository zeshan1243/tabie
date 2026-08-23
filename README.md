# Tabie — Streaming Platform Prototype

A frontend-only React prototype for **Tabie**, reimagining the platform's content and branding
as a premium, Arabic-first streaming experience — combining Tabie's own brand identity
(colors, logo, custom typeface, and slogan) with the UX polish of modern streaming platforms.

This is a **prototype**: all data is mock/static (`src/data`) and structured so a real API can
be swapped in later without touching components or pages.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build
npm run preview   # preview the production build
```

## Stack

- React 19 + React Router 7 (frontend only, no backend)
- Plain CSS with design tokens (`src/styles/theme.css`) — logical properties throughout for
  automatic RTL/LTR mirroring
- Custom i18n context (`src/i18n`) — English + Arabic, persisted language preference, full RTL layout
- Local state via React Context (`src/context`) for My List and playback/notification settings,
  persisted to `localStorage`
- Brand OTF fonts (`QatarTV_beta3-*.otf`) embedded as the primary typeface for both languages

## Project structure

```
src/
├── components/   reusable UI (cards, rails, player controls, badges, modal, icons...)
├── pages/        Home, Live, Search, Content Details, My List, Player, Profile
├── layouts/      Navbar, mobile bottom nav, footer, app shell
├── data/         mock catalog, channels/EPG, genres, profile
├── hooks/        useLocalStorage, useDebouncedValue
├── i18n/         translations + language context
├── context/      My List + settings state
├── utils/        deterministic placeholder art generator, time formatting
└── styles/       theme tokens, fonts, global reset
```

## Notes on content art

Poster/backdrop art for the mock catalog is real key art pulled from Tabie's own live site
(`tabie.net`) — 242 images downloaded to `public/thumbnails/` with a manifest at
`src/data/realThumbnails.json`. Two catalog titles ("Relief After Hardship" / الفرج بعد الشدّة
and "Heroes of the Sands" / أبطال الرمال) are real Tabie originals and are matched to their
exact real poster; every other mock title cycles through the same real-photo pool so the
catalog reads as genuinely photographic rather than generated. Each title's episodes and
player screen reuse that title's own key art (rather than a different random photo per
episode) to avoid showing an unrelated show's baked-in title text.

A deterministic SVG placeholder generator (`src/utils/placeholderArt.js`) is still used for
avatars and channel logos, and remains available as an easy fallback/extension point if you
want fully generated art again.

## Screenshots

See `/screenshots` for captures of the key screens in both languages
(`/screenshots/reference` holds the original inspiration references, kept for context).
