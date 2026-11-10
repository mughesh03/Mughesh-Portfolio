# Mughesh Kumar — Portfolio

A single-page portfolio built with React 18, Vite, Three.js, and Framer Motion.

## Features

- Light theme over a Three.js field of multi-colour round beads (`src/DottedSurface.jsx`)
- Floating bottom dock for navigation, with active-section highlighting
- Hero with a letter-by-letter name reveal, rotating interests, and a round portrait with a spectrum ring
- Résumé highlight counters (edit `HIGHLIGHTS` in `src/App.jsx`)
- Skills grouped by category
- Scroll-drawn timelines for experience and education
- Text-only project cards, publication cards, and award cards, with all details always visible
- A separate accent colour for each section
- Rich-text descriptions sanitized with DOMPurify (safely renders imported HTML)
- Responsive down to phone widths, and respects the reduced-motion setting

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Data

All content lives in `src/data.json`. Update fields there and the site rebuilds automatically in dev mode.
