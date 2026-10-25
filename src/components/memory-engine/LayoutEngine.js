import { templates } from './templates';

/**
 * Intelligently generates pages for the memory book.
 * 
 * If photos define `pageGroup`, it honors the manually curated storytelling sequence.
 * Otherwise, it uses scoring and rhythm to chunk photos dynamically.
 * 
 * @param {Array} photos - Analyzed photos
 * @param {string} theme - 'journal' | 'scrapbook'
 * @returns {Array} An array of page objects: { id, photos, template, theme, stageTitle }
 */
export function generatePages(photos, theme = 'journal') {
  if (!photos || photos.length === 0) return [];

  // Check if photos contain manual pageGroup assignments
  const hasPageGroups = photos.some((p) => p.pageGroup !== undefined);

  if (hasPageGroups) {
    const groupMap = new Map();
    photos.forEach((photo) => {
      const g = photo.pageGroup || 1;
      if (!groupMap.has(g)) groupMap.set(g, []);
      groupMap.get(g).push(photo);
    });

    const sortedGroups = Array.from(groupMap.entries()).sort(([a], [b]) => a - b);

    return sortedGroups.map(([, chunk], index) => {
      // Find the best template for this chunk
      let bestTemplate = null;
      let highestScore = -Infinity;

      for (const t of templates) {
        const score = t.score(chunk);
        if (score > highestScore) {
          highestScore = score;
          bestTemplate = t;
        }
      }

      if (!bestTemplate) {
        bestTemplate =
          templates.find((t) => t.maxPhotos === chunk.length) || templates[0];
      }

      return {
        id: `page-${index + 1}`,
        pageNumber: index + 1,
        photos: chunk,
        template: bestTemplate,
        theme,
        stage: chunk[0]?.stage,
        stageTitle: chunk[0]?.stageTitle,
      };
    });
  }

  // Dynamic chunking fallback
  const rhythm = [1, 2, 2, 3, 2];
  const pages = [];
  let currentIndex = 0;
  let rhythmIndex = 0;

  while (currentIndex < photos.length) {
    let chunkSize = rhythm[rhythmIndex % rhythm.length];
    if (currentIndex + chunkSize > photos.length) {
      chunkSize = photos.length - currentIndex;
    }

    const chunk = photos.slice(currentIndex, currentIndex + chunkSize);

    let bestTemplate = null;
    let highestScore = -Infinity;

    for (const template of templates) {
      const score = template.score(chunk);
      if (score > highestScore) {
        highestScore = score;
        bestTemplate = template;
      }
    }

    if (!bestTemplate) {
      bestTemplate =
        templates.find((t) => t.maxPhotos === chunk.length) || templates[0];
    }

    pages.push({
      id: `page-${pages.length + 1}`,
      pageNumber: pages.length + 1,
      photos: chunk,
      template: bestTemplate,
      theme,
      stage: chunk[0]?.stage,
      stageTitle: chunk[0]?.stageTitle,
    });

    currentIndex += chunkSize;
    rhythmIndex++;
  }

  return pages;
}
