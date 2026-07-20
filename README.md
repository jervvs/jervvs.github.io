# Personal Portfolio

A minimal, extensible portfolio site built with [Astro](https://astro.build). Earth-tone palette, seaside-inspired ambient design, dark/light theming, and a content model where adding new work is as simple as writing a text file.

**Live:** [jervvs.github.io](https://jervvs.github.io)

---

## Quick Start

```bash
git clone https://github.com/jervvs/jervvs.github.io.git
cd jervvs.github.io
npm install
npm run dev
# Open http://localhost:4321
```

---

## Content Model

All content lives in `src/content/`. Here, I have defined four content collection types:
1. Posts
2. Projects
3. Building
4. Photos

The content model is supposed to easily extensible / replaceable. Simply define a collection in `content.config.ts` and you can go from there. Then adding new content is as easy as creating a new Markdown file with the right frontmatter.

### Writing (`src/content/posts/`)

Long-form essays and articles. Sorted by date, newest first.

```markdown
---
title: "Your Post Title"
date: 2026-06-20
description: "Summary for the listing card (optional)."
tags: ["topic", "another"]
draft: false
---

Your content here. Full Markdown supported.
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Appears everywhere — cards, page, RSS |
| `date` | Yes | Controls sort order |
| `description` | No | Card summary. If omitted, card shows no description |
| `tags` | No | Clickable filter pills on the listing page |
| `draft` | No | `true` = hidden from production, visible in `npm run dev` |

**Listing page:** `/writing/` — cards with tag filtering. Paginated at 12 posts per page.

**Detail page:** `/writing/[slug]/` — centered prose with reading progress bar and share button.

### Photography (`src/content/photos/`)

Individual photos grouped into collections (e.g., "Singapore", "Tokyo", "AI Art").

```markdown
---
title: "Morning Tide"
date: 2026-05-15
image: "/images/photos/changi-beach.jpg"
caption: "First light on the shore"
location: "Changi Beach, Singapore"
size: "tall"
collection: "Singapore"
tags: ["sea", "morning"]
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Shown in gallery overlay and lightbox |
| `date` | Yes | Sort within collection |
| `image` | Yes | Path to image file |
| `caption` | No | Shown in lightbox |
| `location` | No | Shown in overlay and lightbox |
| `size` | No | `square` (default), `tall` (2 rows), `wide` (2 columns) |
| `collection` | Yes | Groups photos into sections on the gallery page |
| `tags` | No | For future filtering |

**Gallery page:** `/photography/` — masonry grid grouped by collection, with lightbox on click (keyboard navigable: arrows + Escape).

**Adding a new collection:** Just use a new `collection` name in any photo's frontmatter. It appears as a new section automatically.

### Projects (`src/content/projects/`)

Discrete things you've built. Each has a detail page with body content.

```markdown
---
title: "Project Name"
description: "One-line pitch."
url: "https://github.com/you/project"
order: 1
tags: ["tag"]
---

Write about the project here. What it does, why you built it.
Link to related writing or other work.
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Project name |
| `description` | Yes | Card summary |
| `url` | No | External link — shows "View project ↗" on detail page |
| `order` | No | `0` = pinned to homepage. `1` = default (listing only). Lower = first |
| `tags` | No | Filterable on listing page |

**Listing page:** `/projects/` — cards with tag filtering.

**Detail page:** `/projects/[slug]/` — body content + optional external link.

### Building (`src/content/building/`)

Long-term themes and journeys — things without a finish date. Each Building item ties together related projects and writing via a timeline.

```markdown
---
title: "A Better Me"
description: "Physical health, mental clarity, and habits that compound."
order: 0
relatedWork:
  - "posts/treating-fitness-like-engineering"
  - "projects/90-day-recomp"
tags: ["fitness", "health"]
---

Your content here — what this journey is about,
what it looks like right now, why it matters.
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Theme name |
| `description` | Yes | Card summary |
| `url` | No | External link |
| `order` | No | `0` = pinned to homepage. `1` = default |
| `relatedWork` | No | Array of `"collection/id"` refs — auto-resolves title, date, and URL from each item's frontmatter |
| `tags` | No | Display labels |

**Detail page:** `/building/[slug]/` — body content + auto-generated timeline of related work, sorted by date.

**The `relatedWork` ref format:** `"collection/id"` where collection is `posts`, `projects`, or `building`, and id is the filename without `.md`. The template automatically looks up the title and date from the referenced content. No data duplication.

---

## Homepage

The homepage shows a hero section, an animated wave divider, and category columns. Each column shows items with `order: 0` (pinned). To feature an item on the homepage, set `order: 0` in its frontmatter.

The Photography column shows collection names. The "Now" section reads from `src/content/now.md` — edit this file directly.

---

## Tag Filtering

Writing and Projects listing pages have tag filtering. Tags in frontmatter automatically appear as filter pills. Clicking a tag filters cards instantly (client-side). The URL updates to `?tag=fitness` for sharing.

Tags on cards are display-only — the filter bar at the top of the listing page is the interactive element.

---

## Pagination

Writing paginates automatically at 12 posts per page. Pages are generated at build time as static HTML: `/writing/`, `/writing/2/`, `/writing/3/`, etc.

---

## Media in Posts

### Inline Image
```markdown
![Alt text](/images/your-image.jpg)
*Caption text*
```

### Side-by-Side Images
```html
<div class="media-pair">
  <figure>
    <img src="/images/left.jpg" alt="Left">
    <figcaption>Left</figcaption>
  </figure>
  <figure>
    <img src="/images/right.jpg" alt="Right">
    <figcaption>Right</figcaption>
  </figure>
</div>
```

### Video Embed
```html
<iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

---

## Adding a New Content Type

To add a completely new category (e.g., "Reviews"):

1. **Define the schema** in `src/content.config.ts`:
   ```typescript
   const reviews = defineCollection({
     loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
     schema: z.object({
       title: z.string(),
       date: z.coerce.date(),
       // ... your fields
     }),
   });
   export const collections = { posts, photos, projects, building, reviews };
   ```

2. **Create the folder:** `src/content/reviews/`

3. **Create a listing page** at `src/pages/reviews/index.astro` — copy `src/pages/projects/index.astro` as a template.

4. **Create a detail page** at `src/pages/reviews/[...slug].astro` — copy `src/pages/projects/[...slug].astro`.

5. **Add a nav link** in `src/components/Nav.astro`:
   ```typescript
   { href: '/reviews/', label: 'Reviews' },
   ```

6. **Add a homepage column** in `src/pages/index.astro` — query the collection and add a `<CategoryColumn>`.

7. **Add content** — create `.md` files in `src/content/reviews/`.

8. **Reference from Building** — add `"reviews/my-review"` to any Building item's `relatedWork` array.

---

## Customization

### Colors
Edit CSS custom properties in `src/styles/global.css`:
```css
:root {
  --bg: #FAF7F2;        /* Page background */
  --text: #2B2520;       /* Primary text */
  --accent: #5B6B4A;     /* Links, active states */
  /* ... see file for all tokens */
}
```
Both light and dark themes are defined there.

### Typography
Uses [Outfit](https://fonts.google.com/specimen/Outfit) via `@fontsource/outfit`. To change: install a different `@fontsource/` package, update imports in `global.css`, update `font-family`.

### Site Info
Edit `src/config.ts` for name, tagline, bio, social links, and support/sponsorship links (e.g., Buy Me a Coffee).

### "Now" Section
Edit `src/content/now.md` directly.

### About Page
Edit `src/pages/about.astro` directly. Replace the gradient placeholder with your own photo.

---

## Deployment

### GitHub Pages (default)
Auto-deploys via GitHub Actions on push to `main`. Workflow: `.github/workflows/deploy.yml`.

**First-time setup:**
1. Go to repo → Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to `main`

### Custom Domain
1. Add a `CNAME` file to `public/` with your domain
2. Configure DNS per [GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Other Hosts
Static HTML. `npm run build` → output in `dist/`. Works on Cloudflare Pages, Vercel, Netlify, S3.

---

## Project Structure

```
src/
├── config.ts                 # Site config (name, social links)
├── content.config.ts         # Content collection schemas
├── styles/global.css         # Design tokens, animations, theme
├── layouts/
│   ├── BaseLayout.astro      # HTML shell, nav, theme, sea ambient
│   └── PostLayout.astro      # Writing post layout
├── components/
│   ├── Nav.astro             # Desktop + mobile navigation
│   ├── Logo.astro            # PNG logo with text fallback
│   ├── ThemeToggle.astro     # Dark/light toggle
│   ├── WaveDivider.astro     # Animated SVG wave
│   ├── SeaAmbient.astro      # Drifting ambient glow
│   ├── CategoryColumn.astro  # Homepage category column
│   ├── Footer.astro          # Site-wide footer with support link
│   ├── ContentCard.astro     # Listing card
│   ├── GalleryGrid.astro     # Photography masonry grid
│   ├── Lightbox.astro        # Photo lightbox
│   ├── ReadingProgress.astro # Scroll progress bar
│   └── ShareButton.astro     # Web Share / copy link
├── content/
│   ├── posts/                # Writing (Markdown)
│   ├── photos/               # Photography entries
│   ├── projects/             # Project entries
│   ├── building/             # Building entries
│   └── now.md                # "Now" section
└── pages/                    # Routes
```

## License

MIT
