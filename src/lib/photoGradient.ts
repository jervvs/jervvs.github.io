import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Do the files referenced by photo entries actually exist?
 *
 * Most entries in src/content/photos/ point at images that have not been
 * added yet. Checking at build time lets us render the gradient placeholder
 * on its own — no <img> that 404s, no broken-image glyph, and no console
 * errors — while real photos still render normally.
 */
const missing = new Set<string>();

export function photoExists(image: string): boolean {
  if (missing.has(image)) return false;

  // Astro runs from the project root at build time.
  const path = image.startsWith('/')
    ? join(process.cwd(), 'public', image)
    : image;

  const exists = existsSync(path);
  if (!exists) missing.add(image);
  return exists;
}

export function getPhotoGradient(image: string): string {
  const gradients: Record<string, string> = {
    // Singapore
    'changi-beach': 'linear-gradient(180deg, #c4d4e0, #8ba0b4, #5a7088)',
    'sand-patterns': 'linear-gradient(135deg, #d4c4a8, #b8a88c)',
    'coastal-garden': 'linear-gradient(135deg, #8b9e7e, #6b8060)',
    'driftwood': 'linear-gradient(135deg, #e6dfd4, #c4b89c)',
    'golden-hour': 'linear-gradient(135deg, #d4a87a, #b8886a, #9b7060)',
    'storm-coming': 'linear-gradient(135deg, #7a8e9e, #5a7088)',
    'trail': 'linear-gradient(135deg, #b8c4a8, #8ba07e)',
    'sunset-column': 'linear-gradient(180deg, #c4956a, #a87a50, #8b6040)',
    'concrete-moss': 'linear-gradient(135deg, #9b8e7e, #7a6e5e)',
    // Tokyo
    'shibuya-crossing': 'linear-gradient(135deg, #2a2040, #4a3060, #6a4080)',
    'temple-garden': 'linear-gradient(180deg, #6b8e5a, #4a7040, #3a5830)',
    'tokyo-alley': 'linear-gradient(135deg, #8b6030, #c48840, #e8a850)',
    'fish-market': 'linear-gradient(135deg, #c4a08c, #a88070, #8b6050)',
    'tokyo-tower': 'linear-gradient(180deg, #5a7088, #4a6078, #d47040)',
    // AI Art
    'ai-dreamscape': 'linear-gradient(135deg, #3a2060, #6040a0, #8060c0, #4a3080)',
    'ai-me': 'linear-gradient(135deg, #4a4a5a, #6a6a7a, #8a8a9a)',
    'ai-portrait': 'linear-gradient(135deg, #4a4a5a, #6a6a7a, #8a8a9a)',
    'ai-architecture': 'linear-gradient(180deg, #c0b0a0, #a09080, #706050)',
    'ai-ocean': 'linear-gradient(135deg, #204060, #306080, #4080a0)',
    // Skiing
    'ski-powder': 'linear-gradient(135deg, #d8e8f0, #b0c8d8, #88a8c0)',
    'ski-chairlift': 'linear-gradient(180deg, #6090b0, #4070a0, #305080)',
    'ski-village': 'linear-gradient(135deg, #e0e8f0, #c8d0d8, #a0b0c0)',
    'ski-sunset': 'linear-gradient(135deg, #d09060, #c08050, #4060a0)',
  };

  const name = image.split('/').pop()?.replace(/\.[^.]+$/, '') || '';
  return gradients[name] ?? 'linear-gradient(135deg, #d4c4a8, #b8a88c)';
}