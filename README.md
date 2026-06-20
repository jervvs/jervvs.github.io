# Personal Portfolio

A minimal, extensible portfolio site built with [Astro](https://astro.build). Features writing, projects, photography, and a dark/light theme with seaside-inspired design.

**Live:** [jervvs.github.io](https://jervvs.github.io)

## Quick Start

```bash
git clone https://github.com/jervvs/jervvs.github.io.git
cd jervvs.github.io
npm install
npm run dev
# Open http://localhost:4321
```

## Adding Content

All content lives in `src/content/`. Each content type has its own folder and schema.

### Adding a Post

Create a Markdown file in `src/content/posts/`:

```markdown
---
title: "Your Post Title"
date: 2026-06-20
description: "A short summary for the listing card (optional)."
tags: ["topic", "another"]
draft: false
---

Your content here. Supports full Markdown: **bold**, *italic*, 
[links](https://example.com), code blocks, blockquotes, lists.
```

Set `draft: true` to hide from production. Preview drafts locally with `npm run dev`.

### Adding a Photo

1. Add your image to `public/images/photos/` (or `src/assets/photos/` for optimization)
2. Create a Markdown file in `src/content/photos/`:

```markdown
---
title: "Photo Title"
date: 2026-05-15
image: "/images/photos/your-photo.jpg"
caption: "Optional caption"
location: "Where it was taken"
size: "square"
tags: ["tag1", "tag2"]
---
```

**Size options:**
- `square` (default) — 1×1 grid cell
- `tall` — spans 2 rows, portrait orientation
- `wide` — spans 2 columns, panoramic/landscape

### Adding a Project

Create a file in `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "What it does."
url: "https://github.com/you/project"
order: 1
tags: ["tag1", "tag2"]
---
```

`order` controls the sort order (lower = first). `url` is optional — if set, the card links externally with ↗.

### Adding a Building Item

Same as projects, in `src/content/building/`:

```markdown
---
title: "Thing I'm Working On"
description: "What it is and why."
order: 1
tags: ["tag"]
---
```

### Using Drafts

- Set `draft: true` in any post's frontmatter → hidden from production
- Run `npm run dev` to preview drafts locally
- Set `draft: false` and push → published

### Post Ideas

Jot down ideas in `src/content/posts/_ideas.md`. This file is ignored by Astro (prefixed with `_`).

## Media in Posts

### Inline Image
```markdown
![Alt text](/images/your-image.jpg)
*Caption text below the image*
```

### Side-by-Side Images
```html
<div class="media-pair">
  <figure>
    <img src="/images/left.jpg" alt="Left image">
    <figcaption>Left caption</figcaption>
  </figure>
  <figure>
    <img src="/images/right.jpg" alt="Right image">
    <figcaption>Right caption</figcaption>
  </figure>
</div>
```

### Video Embed
```html
<iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

## Adding a New Content Type

To add a completely new category (e.g., "Talks", "AI Art"):

1. **Define the schema** in `src/content.config.ts`:
   ```typescript
   const talks = defineCollection({
     loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
     schema: z.object({
       title: z.string(),
       date: z.coerce.date(),
       // ... your fields
     }),
   });

   export const collections = { posts, photos, projects, building, talks };
   ```

2. **Create the content folder:** `src/content/talks/`

3. **Create a listing page** at `src/pages/talks/index.astro` — copy `src/pages/projects/index.astro` as a template and adjust the collection name and query.

4. **Add a nav link** in `src/components/Nav.astro` — add to the `links` array:
   ```typescript
   { href: '/talks/', label: 'Talks' },
   ```

5. **Add a homepage column** in `src/pages/index.astro` — query the collection and add a `<CategoryColumn>`.

6. **Add content** — create `.md` files in `src/content/talks/`.

## Customization

### Colors

Edit CSS custom properties in `src/styles/global.css`:

```css
:root {
  --bg: #FAF7F2;        /* Page background */
  --text: #2B2520;       /* Primary text */
  --accent: #5B6B4A;     /* Links, hover states */
  /* ... see global.css for all tokens */
}
```

Both light and dark themes are defined there.

### Typography

The site uses [Outfit](https://fonts.google.com/specimen/Outfit). To change:
1. Install a different `@fontsource/` package
2. Update imports in `src/styles/global.css`
3. Update `font-family` in the body rule

### Site Info

Edit `src/config.ts` for name, tagline, bio, and social links.

### "Now" Section

Edit `src/content/now.md` directly.

### About Page

Edit `src/pages/about.astro` directly. Replace the gradient placeholder with your own photo.

## Deployment

### GitHub Pages (default)

The site auto-deploys via GitHub Actions on push to `main`. The workflow is at `.github/workflows/deploy.yml`.

**First-time setup:**
1. Go to your repo → Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to `main`

### Custom Domain

1. Add a `CNAME` file to `public/` with your domain
2. Configure DNS per [GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Other Hosts

The site is static HTML. `npm run build` outputs to `dist/`. Deploy anywhere: Cloudflare Pages, Vercel, Netlify, S3.

## Project Structure

```
src/
├── config.ts                 # Site config (name, social links)
├── content.config.ts         # Content collection schemas
├── styles/global.css         # Design tokens, animations, theme
├── layouts/
│   ├── BaseLayout.astro      # HTML shell, nav, sea ambient
│   └── PostLayout.astro      # Writing post wrapper
├── components/
│   ├── Nav.astro             # Desktop + mobile navigation
│   ├── ThemeToggle.astro     # Dark/light toggle
│   ├── CategoryColumn.astro  # Homepage category column
│   ├── ContentCard.astro     # Listing card (writing/projects/building)
│   ├── GalleryGrid.astro     # Photography masonry grid
│   ├── Lightbox.astro        # Photo lightbox
│   └── ...                   # Wave divider, sea ambient, etc.
├── content/
│   ├── posts/                # Writing (Markdown)
│   ├── photos/               # Photography entries
│   ├── projects/             # Project entries
│   ├── building/             # Building entries
│   └── now.md                # "Now" section content
└── pages/                    # Routes (one per page)
```

## License

MIT
