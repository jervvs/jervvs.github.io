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
- **Posts** (`src/content/posts/`) — published as **Notes**: title, date, description?, tags?, draft?, series?, order?
- **Projects** (`src/content/projects/`) — published as **Things**: title, description, url?, order? (0 = pinned to homepage), year?, status? (growing/exploring/finished/paused), relatedWork[], tags?
- **Photos** (`src/content/photos/`) — published as **Places**: title, date, image, caption?, location?, size? (square/tall/wide), collection, tags?
- **Now** (`src/content/now.md`): Single markdown file for "Now" section

Files prefixed with `_` are templates and are never published.

### Adding Content
1. Create a `.md` file in the appropriate collection folder with required frontmatter.
2. For new collections:
   - Define schema in `src/content.config.ts`
   - Create folder `src/content/<collectionname>/`
   - Create list page `src/pages/<collectionname>/index.astro` (copy from things)
   - Create detail page `src/pages/<collectionname>/[...slug].astro` (copy from things)
   - Add nav link in `src/components/Nav.astro`
   - Add homepage section in `src/pages/index.astro`
   - Add `relatedWork: ["collectionname/slug"]` to a project to feature that entry in its timeline

## Styling & Theming
- Design tokens: Edit CSS custom properties in `src/styles/global.css`
- Type system: semantic classes `.type-display`, `.type-title`, `.type-subtitle`, `.type-body`, `.type-meta`, `.type-label`, `.type-nav`
- Long-form reading styles: single shared `.prose` block in `global.css` — do not re-declare prose rules per page
- Layout: `.page-content` (max 1280px) plus `.editorial-grid`, which collapses 12 → 8 → 4 columns
- Light/dark theme: Toggles `data-theme` attribute on `<html>`; persists via `localStorage`
- Theme toggle component: `src/components/ThemeToggle.astro`
- Fonts: `@fontsource/newsreader` (serif, display/prose headings) and `@fontsource/outfit` (sans, UI/body)

### Contrast requirement
Every text token must clear WCAG AA (4.5:1) against its background in **both**
themes. `--text-muted` and `--accent` carry small meta text, so they are held
near 4.8:1. If you change a token, re-check contrast rather than assuming.

## Routes
Public URLs use the editorial vocabulary; the collections behind them are unchanged.
- `/things/` ← `src/content/projects/` (was `/projects/`)
- `/notes/` ← `src/content/posts/` (was `/writing/`)
- `/places/` ← `src/content/photos/` (was `/photography/`)

The old paths are kept alive as redirects in `astro.config.mjs`, so existing
inbound links still resolve. Astro emits them as `noindex` meta-refresh pages
and they stay out of the sitemap. If you rename a route, add a redirect here.

## Configuration
- Site metadata (name, tagline, location, social links): `src/config.ts`
- Astro config: `astro.config.mjs` (site URL, redirects, integrations, markdown syntax highlighting)
- TypeScript config: `tsconfig.json` (extends `astro/tsconfigs/strict` with path alias `@/*` → `src/*`)

## Deployment
- Static site: `npm run build` → output in `dist/`
- Deploy `dist/` to any static host (GitHub Pages, Netlify, Vercel, etc.)
- For GitHub Pages: Push to `main` branch (if GitHub Actions workflow is configured)

## Development Notes
- No linting, formatting, or test setup configured (eslint, prettier, vitest absent)
- Uses Astro's built-in Markdown and MDX support
- Client-side interactivity via `astro/components/ClientRouter.astro` for SPA navigation
- Scripts that bind to DOM must re-init on `astro:after-swap`, and must guard against double-binding (e.g. a `dataset.bound` flag)
- No UI framework. Progressive enhancement only: every page must remain readable and navigable with JavaScript disabled
- `prefers-reduced-motion` is a hard requirement for all animation
- Photography placeholders: `src/lib/photoGradient.ts` resolves whether an image exists at build time via `photoExists()`, and `getPhotoGradient()` supplies the fallback. Only emit an `<img>` when `photoExists()` is true — never render an `<img>` that 404s
- RSS feed: `@astrojs/rss` integration
- Sitemap: `@astrojs/sitemap` integration

## Component Inventory
Editorial sections (homepage): `SectionHeading`, `NowBlock`, `ProjectFeature`,
`NoteList`, `PhotoFeature`
Retained: `GalleryGrid`, `Lightbox`, `Timeline`, `ThemeToggle`, `ReadingProgress`,
`ShareButton`

## File Extensions
- `.astro`: Astro components (pages, layouts, UI components)
- `.md`: Content files (frontmatter + Markdown)
- `.ts`: TypeScript configs and utilities
- `.css`: Global styles and tokens
- `.mjs`: ESM config files