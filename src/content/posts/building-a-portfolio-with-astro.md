---
title: "How I Built This Site (And Why You Should Steal It)"
date: 2026-06-20
description: "A non-technical guide to building a personal portfolio that's free to host, beautiful, and shockingly easy to update."
tags: ["web", "astro", "design"]
draft: false
---

I recently rebuilt my personal site. The old one was a static resume page — fine for what it was, but I wanted something that could grow with me. A place for writing, photography, projects, and whatever else I get into.

The result is what you're looking at right now. And the best part? **Adding new content is as easy as writing a text file.**

I'm going to explain how this works, aimed at people who aren't web developers. If you've ever wanted a personal site but felt intimidated by the technical complexity, this post is for you.

## The Problem with Most Websites

Most personal websites fall into two camps:

1. **Site builders** (Squarespace, Wix) — beautiful, but you're locked into their templates, you pay monthly, and you don't own your content in a meaningful way.
2. **Custom code** — total freedom, but you need to be a developer to change anything. Adding a blog post means editing HTML files.

I wanted a third option: something that looks custom and polished, costs nothing to host, and where adding content is as simple as writing in a text editor.

## Enter Astro

[Astro](https://astro.build) is a tool that turns simple text files into a fast, beautiful website. Here's the key insight that makes it special:

**You define what your content looks like once. Then you just add content.**

Think of it like a magazine. Someone designs the magazine layout — the fonts, the columns, where photos go. Then writers and photographers just submit their work, and it flows into the pre-designed layout automatically.

That's exactly what Astro does for websites.

## How Content Works

Every piece of content on this site is a plain text file with some structured information at the top. Here's what a blog post looks like:

```
---
title: "My Post Title"
date: 2026-06-20
description: "A short summary."
tags: ["topic"]
---

The rest is just your writing.
You can use **bold**, *italic*, and links.
```

That's it. The `---` section at the top (called "frontmatter") is the structured data — title, date, tags. Everything below is your content, written in Markdown (a simple formatting syntax that's basically just plain English with a few symbols for bold, italic, headers, etc.).

When you save this file and push it to GitHub, the site automatically rebuilds and your post appears — fully styled, with the right fonts, layout, navigation, and everything.

## The Schema: Your Content Contract

Here's where it gets clever. Astro lets you define a **schema** for each type of content. The schema is a contract that says "every post must have a title, a date, and optionally a description and tags."

Why does this matter? Because it means:

1. **You can't accidentally publish broken content.** If you forget the title, the build fails and tells you exactly what's missing.
2. **Every post looks consistent.** The schema ensures that the listing page always has the data it needs to render cards.
3. **Adding a new type of content is structured.** Want to add a photography section? Define a schema (title, date, image, location), create a gallery template, and you're done. Every photo you add after that follows the same pattern.

This site has four content types:

- **Writing** — title, date, description, tags
- **Photography** — title, date, image, location, collection name
- **Projects** — title, description, link
- **Building** — title, description (things in progress)

Each one is just a folder of text files. Adding a new photo means creating a text file with the right fields and dropping an image next to it.

## What It Costs

**Nothing.** The site is hosted on GitHub Pages, which is free. The domain (`jervvs.github.io`) is free. The tools (Astro, the text editor) are free. There are no monthly fees, no subscriptions, no vendor lock-in.

If I ever want a custom domain like `jervischan.com`, the only cost is the domain registration (~$12/year). Everything else stays free.

## The Design

The design uses earth tones inspired by [Aesop](https://www.aesop.com) — warm cream backgrounds, sage green accents, and the Outfit typeface. There's a dark mode toggle, subtle seaside-inspired animations (a wave divider, drifting ambient light), and a film grain texture that makes the screen feel less like a screen.

None of this required a designer. It required *taste* — picking a color palette, a font, and a layout philosophy (minimal, text-forward, inspired by [Paco Coursey's site](https://paco.me)) — and then implementing it consistently.

## Should You Build One?

If you have things to share — writing, photography, projects, ideas — and you want a home for them that you actually own, I think the answer is yes.

The code for this site is [on GitHub](https://github.com/jervvs/jervvs.github.io). You can fork it, replace my content with yours, change the colors, and have your own portfolio site running in an afternoon. The README explains everything step by step.

The hardest part isn't the technology. It's deciding to start.
