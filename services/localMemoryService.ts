import type { AnalysisResult, KnowledgeBaseEntry, FrameworkError, RepairHistoryEntry, RepairScriptStatus, MemoryExport } from '../types';

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

// --- Collaborative Sharing Management ---

export function exportMemory(): string {
    const learnedKnowledge = getLearnedKnowledge();
    const repairHistory = getRepairHistory();
    
    const exportData: MemoryExport = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
            learnedKnowledge,
            repairHistory
        }
    };
    
    return JSON.stringify(exportData, null, 2);
}

export function importMemory(jsonString: string): { success: boolean, error?: string } {
    try {
        const parsed: MemoryExport = JSON.parse(jsonString);

        if (parsed.version === 1 && parsed.data && Array.isArray(parsed.data.learnedKnowledge) && Array.isArray(parsed.data.repairHistory)) {
            // Data structure seems valid, save it
            saveLearnedKnowledge(parsed.data.learnedKnowledge);
            saveRepairHistory(parsed.data.repairHistory);
            return { success: true };
        } else {
            return { success: false, error: 'Invalid or corrupted file format.' };
        }
    } catch (e) {
        console.error("Failed to import memory:", e);
        return { success: false, error: 'File is not a valid JSON.' };
    }
}
