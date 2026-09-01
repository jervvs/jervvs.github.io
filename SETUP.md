# First-Run Setup Checklist

Follow these steps in order to personalize and deploy your copy of this portfolio.

---

## 1. Rename the Repository

Your repo must be named `<your-username>.github.io` (e.g., `alice.github.io`) for GitHub Pages to serve it at `https://alice.github.io`.

**On GitHub:**
- Go to Settings → General → Repository name
- Rename to `<your-username>.github.io`

**Locally (after cloning):**
```bash
git remote set-url origin https://github.com/<your-username>/<your-username>.github.io.git
```

---

## 2. Edit Site Configuration (`src/config.ts`)

Update these fields with your info:

```typescript
export const siteConfig = {
  name: "Your Name",
  tagline: "Your tagline / role",
  bio: "Short bio for the About page and meta description.",
  socialLinks: [
    { label: "GitHub", href: "https://github.com/your-username", icon: "github" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-username", icon: "linkedin" },
    { label: "Email", href: "mailto:you@example.com", icon: "mail" },
  ],
  supportLinks: [
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/your-username" },
  ],
};
```

---

## 3. Replace About Page Photo

The About page (`src/pages/about.astro`) shows a gradient placeholder. Replace it with your photo:

```bash
# Add your photo to public/images/
cp your-photo.jpg public/images/about.jpg
```

Then edit `src/pages/about.astro` — replace the placeholder `<div class="photo-placeholder">` with:
```astro
<img src="/images/about.jpg" alt="Your Name" class="about-photo" />
```

---

## 4. Edit "Now" Section (`src/content/now.md`)

This appears on the homepage. Write a short status update:

```markdown
---
title: "Now"
---

Updated **August 2026**

- Currently building: [Project Name](https://example.com)
- Learning: Rust, distributed systems
- Reading: *Book Title* by Author
- Listening to: Album / Playlist
```

---

## 5. Customize Colors (`src/styles/global.css`)

Edit the CSS custom properties in `:root` (light theme) and `[data-theme="dark"]` (dark theme):

```css
:root {
  --bg: #FAF7F2;
  --text: #2B2520;
  --accent: #5B6B4A;
  --muted: #8B7D6B;
  --border: #E8E0D4;
  --card: #FFFFFF;
  --wave: #5B6B4A;
}

[data-theme="dark"] {
  --bg: #1A1612;
  --text: #F5F0E8;
  --accent: #8FB36B;
  --muted: #9A8B7A;
  --border: #3D342B;
  --card: #231E19;
  --wave: #8FB36B;
}
```

**Quick presets** — replace the `:root` block with one of these:

| Theme | `--bg` | `--text` | `--accent` | `--muted` | `--border` | `--card` | `--wave` |
|-------|--------|----------|------------|-----------|------------|----------|----------|
| Earth (default) | `#FAF7F2` | `#2B2520` | `#5B6B4A` | `#8B7D6B` | `#E8E0D4` | `#FFFFFF` | `#5B6B4A` |
| Ocean | `#F0F5F8` | `#1B2A3A` | `#3A7CA5` | `#7A9BAE` | `#D0DCE6` | `#FFFFFF` | `#3A7CA5` |
| Forest | `#F0F5F0` | `#1A2E1A` | `#4A7C4A` | `#7A9B7A` | `#D0E6D0` | `#FFFFFF` | `#4A7C4A` |
| Sunset | `#FFF8F0` | `#3D2B1F` | `#D46B3A` | `#B88B6B` | `#F5E0D0` | `#FFFFFF` | `#D46B3A` |
| Monochrome | `#FAFAFA` | `#1A1A1A` | `#333333` | `#888888` | `#E0E0E0` | `#FFFFFF` | `#333333` |

---

## 6. Delete/Replace Placeholder Content

The repo includes sample content to show the site structure. **Delete or replace all of it before going live.**

| Collection | Folder | What to do |
|------------|--------|------------|
| Posts | `src/content/posts/` | Delete `_ideas.md` and sample posts, or keep as drafts (`draft: true`) |
| Projects | `src/content/projects/` | Replace `90-day-recomp.md`, `incident-playbook.md`, `this-site.md` |
| Building | `src/content/building/` | Replace `better-me.md`, `writing-habit.md` |
| Photos | `src/content/photos/` | Replace all `.md` files and images in `public/images/photos/` |

**To hide without deleting:** add `draft: true` to any item's frontmatter.

---

## 7. Custom Domain (Optional)

If you have a domain (e.g., `yourname.com`):

1. Create `public/CNAME` with your domain:
   ```
   yourname.com
   ```
2. Configure DNS (A records to GitHub Pages IPs, or CNAME to `<username>.github.io`)
3. In repo Settings → Pages → Custom domain, enter your domain and enforce HTTPS

---

## 8. Enable GitHub Pages (Required)

1. Go to repo → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, select **"GitHub Actions"**
3. Save

This uses `.github/workflows/deploy.yml` to build with Astro and deploy to Pages.

---

## 9. Preview Locally

```bash
npm install
npm run dev
# Open http://localhost:4321
```

Verify everything looks right: homepage, writing, projects, building, photography, about, now section, dark/light toggle.

---

## 10. Push and Confirm Deploy

```bash
git add .
git commit -m "Personalize site config and content"
git push origin main
```

Go to the **Actions** tab and watch the "Deploy to GitHub Pages" workflow. Once it succeeds (green checkmark), visit `https://<your-username>.github.io`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails with YAML error | Check frontmatter — ensure no unescaped colons, proper indentation |
| Images not showing | Verify paths in frontmatter match files in `public/images/` |
| Styles not updating | Hard refresh (Cmd/Ctrl+Shift+R) — CSS is cached |
| `CLAUDE.md` not a symlink on Windows | Run `git config core.symlinks true` before cloning, or re-clone with Developer Mode enabled |
| Pages shows 404 | Confirm Source is "GitHub Actions" (not "Deploy from a branch") |

---

## Next Steps

- Read `README.md` for full content model and customization details
- Add your first real post: `src/content/posts/my-first-post.md`
- Consider enabling the `creating-new-content-type` skill if you want to add more content categories