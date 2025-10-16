import type { AnalysisResult, KnowledgeBaseEntry, FrameworkError } from '../types';

const LOCAL_STORAGE_KEY = 'sat18-learned-knowledge';

// Helper to get all learned knowledge from localStorage
export function getLearnedKnowledge(): KnowledgeBaseEntry[] {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to parse learned knowledge from localStorage:", error);
        return [];
    }
}

// Helper to save the entire learned knowledge base to localStorage
function saveLearnedKnowledge(knowledge: KnowledgeBaseEntry[]): void {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(knowledge));
    } catch (error) {
        console.error("Failed to save learned knowledge to localStorage:", error);
    }
}

// Adds a new analysis result to the learned knowledge
export function addResultToKnowledge(result: AnalysisResult): void {
    const learnedKnowledge = getLearnedKnowledge();
    
    const newError: FrameworkError = {
        error: result.match,
        solution: result.solution,
    };

    const frameworkIndex = learnedKnowledge.findIndex(
        entry => entry.framework.toLowerCase() === result.framework.toLowerCase()
    );

    if (frameworkIndex > -1) {
        // Framework exists, check if error already exists
        const frameworkEntry = learnedKnowledge[frameworkIndex];
        const errorExists = frameworkEntry.errors.some(
            err => err.error.toLowerCase() === newError.error.toLowerCase()
        );
        if (!errorExists) {
            frameworkEntry.errors.push(newError);
        }
    } else {
        // Framework doesn't exist, create a new entry
        // We don't have icons for learned entries, so we omit it.
        learnedKnowledge.push({
            framework: result.framework,
            errors: [newError],
            icon: () => null, // Learned items don't have a default icon
        });
    }

    saveLearnedKnowledge(learnedKnowledge);
}
