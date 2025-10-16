// utils/fuzzyMatch.ts
/**
 * Calculates the Jaccard similarity between two strings.
 * The strings are tokenized by splitting on non-alphanumeric characters.
 * @param a The first string.
 * @param b The second string.
 * @returns A similarity score between 0 and 1.
 */
export function fuzzyMatch(a: string, b: string): number {
  if (!a || !b) return 0;
  
  // Normalize and tokenize the strings
  const tokensA = a.toLowerCase().split(/\W+/).filter(Boolean);
  const tokensB = b.toLowerCase().split(/\W+/).filter(Boolean);

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}
