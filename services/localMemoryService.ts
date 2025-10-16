import type { AnalysisResult, KnowledgeBaseEntry, FrameworkError, RepairHistoryEntry, RepairScriptStatus } from '../types';

const KNOWLEDGE_KEY = 'sat18-learned-knowledge';
const HISTORY_KEY = 'sat18-repair-history';

// --- Knowledge Base Management ---

export function getLearnedKnowledge(): KnowledgeBaseEntry[] {
    try {
        const data = localStorage.getItem(KNOWLEDGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to parse learned knowledge from localStorage:", error);
        return [];
    }
}

function saveLearnedKnowledge(knowledge: KnowledgeBaseEntry[]): void {
    try {
        localStorage.setItem(KNOWLEDGE_KEY, JSON.stringify(knowledge));
    } catch (error) {
        console.error("Failed to save learned knowledge to localStorage:", error);
    }
}

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
        const frameworkEntry = learnedKnowledge[frameworkIndex];
        const errorExists = frameworkEntry.errors.some(
            err => err.error.toLowerCase() === newError.error.toLowerCase()
        );
        if (!errorExists) {
            frameworkEntry.errors.push(newError);
        }
    } else {
        learnedKnowledge.push({
            framework: result.framework,
            errors: [newError],
            icon: () => null,
        });
    }

    saveLearnedKnowledge(learnedKnowledge);
}

// --- Repair History Management ---

export function getRepairHistory(): RepairHistoryEntry[] {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        // Returns sorted by most recent first
        return data ? JSON.parse(data).sort((a: RepairHistoryEntry, b: RepairHistoryEntry) => b.timestamp - a.timestamp) : [];
    } catch (error) {
        console.error("Failed to parse repair history from localStorage:", error);
        return [];
    }
}

function saveRepairHistory(history: RepairHistoryEntry[]): void {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save repair history to localStorage:", error);
    }
}

export function addScriptToHistory(entry: Omit<RepairHistoryEntry, 'timestamp' | 'status'>): void {
    const history = getRepairHistory();
    const newEntry: RepairHistoryEntry = { ...entry, timestamp: Date.now(), status: 'unknown' };
    // Add to the beginning of the array
    history.unshift(newEntry);
    saveRepairHistory(history);
}

export function updateScriptStatus(timestamp: number, status: RepairScriptStatus): void {
    const history = getRepairHistory();
    const entryIndex = history.findIndex(item => item.timestamp === timestamp);
    if (entryIndex > -1) {
        // If the current status is the same as the new one, toggle it back to 'unknown'
        history[entryIndex].status = history[entryIndex].status === status ? 'unknown' : status;
        saveRepairHistory(history);
    }
}


export function clearRepairHistory(): void {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear repair history from localStorage:", error);
    }
}