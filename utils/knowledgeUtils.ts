import type { AnalysisResult, KnowledgeBaseEntry } from '../types';

/**
 * Checks if a given analysis result is already present in the knowledge base.
 * It performs a case-insensitive check on both the framework and the error match.
 */
export function isKnownError(result: AnalysisResult, knowledgeBase: KnowledgeBaseEntry[]): boolean {
    const frameworkEntry = knowledgeBase.find(
        entry => entry.framework.toLowerCase().split('/')[0].trim() === result.framework.toLowerCase().split('/')[0].trim()
    );

    if (!frameworkEntry) {
        return false;
    }

    return frameworkEntry.errors.some(
        knownError => knownError.error.toLowerCase() === result.match.toLowerCase()
    );
}
