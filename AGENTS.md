# Agent Guidelines for jervvs.github.io

> Also readable as `CLAUDE.md` (symlinked to this file).

## Skills

Prefer these skills over manual file edits when available:
- **`creating-new-content-type`** — scaffolds a new content collection (schema, folder, pages, nav link, homepage column)
- **`customise-website`** — walks through personalizing site config, colors, fonts, About page, and "Now" section

Never commit real personal data on this user's behalf without confirming it's actually theirs to publish — this is a public GitHub Pages site.

## Quick Start
- Install: `npm install`
- Dev server: `npm run dev` (http://localhost:4321)
- Build: `npm run build` (outputs to `dist/`)
- Preview: `npm run preview`

## Content Model
All content lives in `src/content/` as Markdown with YAML frontmatter:
- **Posts** (`src/content/posts/`): title, date, description?, tags?, draft?, series?, order?
- **Projects** (`src/content/projects/`): title, description, url?, order? (0 = pinned to homepage), tags?
- **Building** (`src/content/building/`): title, description, url?, order? (0 = pinned to homepage), relatedWork[], tags?
- **Photos** (`src/content/photos/`): title, date, image, caption?, location?, size? (square/tall/wide), collection, tags?
- **Now** (`src/content/now.md`): Single markdown file for "Now" page

### Adding Content
1. Create a `.md` file in the appropriate collection folder with required frontmatter.
2. For new collections:
   - Define schema in `src/content.config.ts`
   - Create folder `src/content/<collectionname>/`
   - Create list page `src/pages/<collectionname>/index.astro` (copy from projects)
   - Create detail page `src/pages/<collectionname>/[...slug].astro` (copy from projects)
   - Add nav link in `src/components/Nav.astro`
   - Add homepage column in `src/pages/index.astro`
   - Reference from Building via `relatedWork: ["collectionname/slug"]`

## Styling & Theming
- Design tokens: Edit CSS custom properties in `src/styles/global.css`
- Light/dark theme: Toggles `data-theme` attribute on `<html>`; persists via `localStorage`
- Theme toggle component: `src/components/ThemeToggle.astro`
- Font: `@fontsource/outfit` (change in `global.css`)

## Configuration
- Site metadata (name, tagline, social links): `src/config.ts`
- Astro config: `astro.config.mjs` (site URL, integrations, markdown syntax highlighting)
- TypeScript config: `tsconfig.json` (extends `astro/tsconfigs/strict` with path alias `@/*` → `src/*`)

## Deployment
- Static site: `npm run build` → output in `dist/`
- Deploy `dist/` to any static host (GitHub Pages, Netlify, Vercel, etc.)
- For GitHub Pages: Push to `main` branch (if GitHub Actions workflow is configured)

## Development Notes
- No linting, formatting, or test setup configured (eslint, prettier, vitest absent)
- Uses Astro's built-in Markdown and MDX support
- Client-side interactivity via `astro/components/ClientRouter.astro` for SPA navigation
- Sea ambient effect: `SeaAmbient.astro` (animated SVG)
- Image optimization: Uses Astro's built-in Image service (via `<Img/>` component implicitly)
- RSS feed: `@astrojs/rss` integration
- Sitemap: `@astrojs/sitemap` integration

## File Extensions
- `.astro`: Astro components (pages, layouts, UI components)
- `.md`: Content files (frontmatter + Markdown)
- `.ts`: TypeScript configs and utilities
- `.css`: Global styles and tokens
- `.mjs`: ESM config files