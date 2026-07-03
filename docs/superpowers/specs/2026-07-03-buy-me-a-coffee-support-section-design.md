# Buy Me a Coffee Support Section

**Date:** 2026-07-03
**Status:** Approved

## Goal

Add a Buy Me a Coffee sponsorship presence to the site — a "Support" section on the about page and a minimal site-wide footer — so visitors can support the creator's work.

## Target audience

People who find Jervis's guides, resources, and site template useful. The site is designed to be easily forked, and the content focuses on inspiring people to create and build (e.g., their own personal site using markdown files). Supporters are non-technical readers who get value from this.

## Monetization platform

**Buy Me a Coffee** — chosen for low friction, broad audience appeal (not developer-specific), and simplicity. No GitHub Sponsors or Patreon for now.

## Research: what makes support CTAs effective

Three patterns from UX research (NNGroup) and successful creator pages (Sindre Sorhus, Mark Manson):

1. **Mission clarity beats everything** — Donors care 3.6x more about understanding what you're building toward than any other factor.
2. **Specificity over vagueness** — Concrete goals ("a library of guides so anyone can launch a site") outperform generic "if you like my work" asks.
3. **Low-pressure framing** — Casual, non-transactional language. No guilt, no urgency. Trust through simplicity.

## Changes

### 1. Config (`src/config.ts`)

Add `buymeacoffee` to `SITE.social`:

```ts
buymeacoffee: { url: 'https://buymeacoffee.com/your-username', label: 'Buy Me a Coffee' },
```

Centralizes the URL so both the about page and footer reference the same source.

### 2. About page section (`src/pages/about.astro`)

New "Support" section between "Outside Work" and "Connect". Uses the same `about-section` pattern as existing sections.

**Copy:**

> I'm building guides and resources to inspire more people to create and build — like building their own personal site like this one! If that sounds worth having in the world, a coffee goes a long way.

Followed by a `☕ Buy Me a Coffee` link using the existing `text-link` class.

### 3. Footer component (`src/components/Footer.astro`)

New component. Single line:

```
Built by Jervis Chan · Support this project ☕
```

- "Support this project" links to the BMaC page
- Uses `text-muted` color, `text-link` styling for the link
- Separated from page content by a top border, matching the site's `--border` color

### 4. Wire footer into layout (`src/layouts/BaseLayout.astro`)

Import `Footer.astro` and render it after `<slot />` inside `<main>` (or after `</main>`).

## Files changed

| File | Action |
|---|---|
| `src/config.ts` | Modified — add BMaC URL |
| `src/pages/about.astro` | Modified — add Support section |
| `src/components/Footer.astro` | **Created** — new footer component |
| `src/layouts/BaseLayout.astro` | Modified — import and render Footer |

## Out of scope

- Dedicated `/support/` page
- Blog post callout banners
- Multiple sponsorship platforms
- Newsletter/email signup (separate initiative)
