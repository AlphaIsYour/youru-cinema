// app/lib/animeMapping.ts

export function formatTitleForGogoanime(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const ANIME_TITLE_MAPPINGS: Record<number, string> = {
  5114: "fullmetal-alchemist-brotherhood",
  9253: "steinsgate",
  11061: "hunter-x-hunter-2011",
  16498: "shingeki-no-kyojin",
  1535: "death-note",
  28977: "gintama",
  38524: "shingeki-no-kyojin-season-3",
  40028: "shingeki-no-kyojin-season-3-part-2",
  // Add more as needed
};

export function getGogoanimeId(malId: number, title: string): string {
  if (ANIME_TITLE_MAPPINGS[malId]) {
    return ANIME_TITLE_MAPPINGS[malId];
  }
  return formatTitleForGogoanime(title);
}

const searchCache = new Map<string, string>();

export async function resolveGogoanimeId(
  malId: number,
  title: string,
): Promise<string> {
  const cacheKey = `${malId}-${title}`;

  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  if (ANIME_TITLE_MAPPINGS[malId]) {
    const id = ANIME_TITLE_MAPPINGS[malId];
    searchCache.set(cacheKey, id);
    return id;
  }

  const formatted = formatTitleForGogoanime(title);
  searchCache.set(cacheKey, formatted);
  return formatted;
}
