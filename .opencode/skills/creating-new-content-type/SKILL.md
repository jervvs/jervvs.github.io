# Skill: creating-new-content-type

Scaffolds a new content collection (schema, folder, pages, nav link, homepage column).

## When to Use

User wants to add a completely new content category (e.g., "Reviews", "Talks", "Newsletter").

## Workflow

### 1. Gather Requirements

Ask the user:
- Collection name (singular, e.g., "review")
- Display name (plural, e.g., "Reviews")
- Required frontmatter fields
- Optional frontmatter fields
- Whether it needs a detail page (yes/no)
- Whether items should be pinnable to homepage (`order: 0`)

### 2. Update `src/content.config.ts`

Add the collection schema:

```typescript
// Add import if needed
import { z } from 'zod';
import { glob } from 'astro/loaders';

// Define the collection
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // Add required fields here
    // Add optional fields with .optional()
  }),
});

// Add to export
export const collections = { posts, photos, projects, building, reviews };
```

### 3. Create Content Folder

```bash
mkdir -p src/content/reviews
```

### 4. Create Listing Page

Copy `src/pages/projects/index.astro` → `src/pages/reviews/index.astro`
- Update collection query: `getCollection('reviews')`
- Update page title, headings, empty state

### 5. Create Detail Page (if needed)

Copy `src/pages/projects/[...slug].astro` → `src/pages/reviews/[...slug].astro`
- Update collection query
- Update layout imports if different

### 6. Add Nav Link

Edit `src/components/Nav.astro`:
```typescript
const navItems = [
  // ... existing items
  { href: '/reviews/', label: 'Reviews' },
];
```

### 7. Add Homepage Column

Edit `src/pages/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
// ...
const reviews = (await getCollection('reviews')).filter(r => !r.data.draft);
// ...
---
<!-- Add CategoryColumn for reviews -->
<CategoryColumn
  title="Reviews"
  href="/reviews/"
  items={reviews.filter(r => r.data.order === 0).slice(0, 3)}
/>
```

### 8. Create Starter Content

Create `src/content/reviews/_example.md` with all fields shown and commented.

### 9. Optional: Wire into Building

If user wants `relatedWork` support, remind them to add `"reviews/slug"` format.

### 10. Verify

```bash
npm run dev
# Check: nav link works, listing page loads, detail page loads, homepage column shows
```

## Notes

- Always use `npm run dev` to verify before committing
- Follow existing patterns exactly — copy from `projects/` not from scratch
- The `_example.md` should have `draft: true` so it doesn't go live