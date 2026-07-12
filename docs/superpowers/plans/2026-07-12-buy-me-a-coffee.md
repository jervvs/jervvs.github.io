# Buy Me a Coffee Support Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Buy Me a Coffee link to the about page and a site-wide footer so visitors can support the creator's work.

**Architecture:** Add a `SITE.support` config key, a new "Support" section on the about page, a `Footer.astro` component rendered inside `<main>` in `BaseLayout.astro`, and a padding adjustment in `global.css`.

**Tech Stack:** Astro 6.4.8, static HTML/CSS

**Spec:** `docs/superpowers/specs/2026-07-03-buy-me-a-coffee-support-section-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/config.ts` | Modify | Add `SITE.support` object with BMaC URL |
| `src/components/Footer.astro` | Create | Minimal site-wide footer component |
| `src/layouts/BaseLayout.astro` | Modify | Import and render Footer after `<slot />` |
| `src/styles/global.css` | Modify | Reduce `.page-content` padding-bottom |
| `src/pages/about.astro` | Modify | Add "Support" section between "Outside Work" and "Connect" |

---

### Task 1: Add `SITE.support` to config

**Files:**
- Modify: `src/config.ts`

- [ ] **Step 1: Add the support object**

Add a `support` key to `SITE`, after the `social` block:

```ts
export const SITE = {
  name: 'Jervis Chan',
  tagline: 'I love cool technology and great products.',
  bio: 'Building reliability at scale. Interested in systems thinking, automation, and the craft of making things work well.',
  url: 'https://jervvs.github.io',
  social: {
    tiktok: { url: 'https://www.tiktok.com/@jervisch', label: 'TikTok' },
    linkedin: { url: 'https://www.linkedin.com/in/jervis-chan/', label: 'LinkedIn' },
    email: { url: 'mailto:chanjy09@live.com', label: 'email' },
  },
  support: {
    buymeacoffee: { url: 'https://buymeacoffee.com/your-username', label: 'Buy Me a Coffee' },
  },
};
```

- [ ] **Step 2: Verify the dev server still builds**

Run: `npm run dev`
Expected: No errors. Homepage and about page render unchanged (the new key is not consumed yet).

- [ ] **Step 3: Commit**

```bash
git add src/config.ts
git commit -m "feat: add SITE.support config for Buy Me a Coffee"
```

---

### Task 2: Create the Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { SITE } from '../config';

const bmac = SITE.support.buymeacoffee;
---

<footer class="site-footer">
  <span>Built by {SITE.name}</span>
  <span class="footer-sep">&middot;</span>
  <a href={bmac.url} class="text-link" target="_blank" rel="noopener noreferrer">Support this project ☕</a>
</footer>

<style>
  .site-footer {
    padding: 32px 0 48px;
    border-top: 1px solid var(--border);
    font-size: 13px;
    font-weight: 300;
    color: var(--text-muted);
    text-align: center;
    transition: color 0.3s, border-color 0.4s;
  }

  .footer-sep {
    margin: 0 8px;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component with Buy Me a Coffee link"
```

---

### Task 3: Wire footer into BaseLayout and adjust padding

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css:236-242`

- [ ] **Step 1: Import and render Footer in BaseLayout**

In `src/layouts/BaseLayout.astro`, add the import at the top of the frontmatter block:

```ts
import Footer from '../components/Footer.astro';
```

Then render `<Footer />` after `<slot />` inside `<main>`:

```astro
<main class="page-content">
  <slot />
  <Footer />
</main>
```

- [ ] **Step 2: Reduce page-content bottom padding**

In `src/styles/global.css`, change line 239 from:

```css
padding: 48px 24px 100px;
```

to:

```css
padding: 48px 24px 48px;
```

- [ ] **Step 3: Verify footer renders on all pages**

Run: `npm run dev`
Check these pages in the browser:
- `/` — footer visible below Connect section
- `/about/` — footer visible below Connect section
- `/writing/` — footer visible below post listings
- `/photography/` — footer visible below gallery

Expected: Footer appears at bottom of every page, aligned with content column, subtle top border, muted text.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: render Footer in BaseLayout, reduce bottom padding"
```

---

### Task 4: Add Support section to about page

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Add the Support section**

In `src/pages/about.astro`, add a new section between the "Outside Work" section (ends at line 58) and the "Connect" section (starts at line 60). Insert after the closing `</section>` of "Outside Work":

```astro
<section class="about-section">
  <div class="section-label">Support</div>
  <p>I'm building guides and resources to inspire more people to create and build — like building their own personal site like this one! If that sounds worth having in the world, a coffee goes a long way.</p>
  <a href={SITE.support.buymeacoffee.url} class="text-link support-link" target="_blank" rel="noopener noreferrer">☕ {SITE.support.buymeacoffee.label}</a>
</section>
```

- [ ] **Step 2: Add the support-link style**

Add to the `<style>` block in about.astro:

```css
.support-link {
  display: inline-block;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 400;
}
```

- [ ] **Step 3: Verify the about page**

Run: `npm run dev`, navigate to `/about/`

Expected:
- "Support" section appears between "Outside Work" and "Connect"
- Copy renders correctly with the BMaC link
- Same visual treatment as other about sections (top border, section-label heading)
- Existing "Connect" section still shows only TikTok, LinkedIn, email (no BMaC leak)

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add Support section to about page with Buy Me a Coffee link"
```

---

### Task 5: Final verification and build check

- [ ] **Step 1: Run a production build**

Run: `npm run build`
Expected: Build completes with zero errors.

- [ ] **Step 2: Preview the production build**

Run: `npm run preview`
Spot-check `/`, `/about/`, and one blog post. Verify:
- Footer renders on all pages
- Support section renders on about page
- Connect sections are unaffected (no BMaC in social links)
- Dark mode toggle works with footer (border and text colors transition)
