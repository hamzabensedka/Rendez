/**
 * Text utility functions for search feature
 */

/**
 * Normalize a search query for comparison
 * Removes extra whitespace and converts to lowercase
 */
export function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Check if a text contains a query (case-insensitive)
 */
export function textContainsQuery(text: string, query: string): boolean {
  return normalizeQuery(text).includes(normalizeQuery(query));
}

/**
 * Get all indices where a query appears in text (case-insensitive)
 */
export function getQueryIndices(text: string, query: string): number[] {
  const normalizedText = normalizeQuery(text);
  const normalizedQuery = normalizeQuery(query);
  const indices: number[] = [];
  let index = normalizedText.indexOf(normalizedQuery);

  while (index !== -1) {
    indices.push(index);
    index = normalizedText.indexOf(normalizedQuery, index + 1);
  }

  return indices;
}
