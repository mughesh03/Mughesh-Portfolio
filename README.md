# Mughesh Kumar — Portfolio

A cinematic, single-page portfolio built with React 18, Vite, and Framer Motion.

## Features

- Animated Canvas 2D "video-style" motion background (drifting aurora blobs + starfield + subtle grid pulse)
- Sticky glassmorphic navigation with active-section highlighting
- Hero with animated gradient name, orbital portrait rings, and scroll cue
- Timeline layout for experience and education
- 3D-tilt project cards with cursor-tracked glow
- Expandable publications & awards
- Rich-text descriptions sanitized with DOMPurify (safely renders imported HTML)
- Fully responsive, dark theme

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
