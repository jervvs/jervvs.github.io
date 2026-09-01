---
name: "🚀 First-Run Setup"
about: "Track your initial setup of this portfolio template"
title: "🚀 First-run setup"
labels: ["setup", "first-run"]
assignees: []
---

Follow this checklist to personalize and deploy your copy of this portfolio.

---

## 📋 Setup Checklist

### Repository & Deployment
- [ ] **Rename repo** to `<your-username>.github.io` (Settings → General → Repository name)
- [ ] **Enable GitHub Pages** with "GitHub Actions" as Source (Settings → Pages → Build and deployment → Source: GitHub Actions)
- [ ] **Verify deploy works** — check Actions tab for green "Deploy to GitHub Pages" workflow

### Site Configuration
- [ ] **Edit `src/config.ts`** — your name, tagline, bio, social links
- [ ] **Edit `src/content/now.md`** — your current status update
- [ ] **Customize colors** in `src/styles/global.css` (or pick a preset from SETUP.md)

### Content
- [ ] **Replace About photo** — add image to `public/images/about.jpg` and update `src/pages/about.astro`
- [ ] **Delete/replace placeholder content** in all collections:
  - [ ] `src/content/posts/` (keep `_example.md` as template)
  - [ ] `src/content/projects/` (keep `_example.md` as template)
  - [ ] `src/content/building/` (keep `_example.md` as template)
  - [ ] `src/content/photos/` (keep `_example.md` as template)
- [ ] **Add your first real post/project/photo**

### Optional
- [ ] **Custom domain** — add `public/CNAME` and configure DNS
- [ ] **Try Codespaces** — Code → Codespaces → Create codespace on main
- [ ] **Read `README.md`** for full content model and customization details

---

## 📖 References

- **SETUP.md** — detailed step-by-step guide with color presets
- **README.md** — full documentation (content model, adding new types, deployment)
- **AGENTS.md** — agent instructions (also symlinked as `CLAUDE.md`)

---

**Tip:** Check items off as you go. This issue stays open until you're fully set up!