import type { KnowledgeBaseEntry, RepairHistoryEntry, MemoryPackage, QuarantinedMemoryPackage, QuarantineStatus, MergeStrategy, AuditLogEntry, AuditAction, StateSnapshot } from '../types';
import { isRiskyScript } from '../utils/scriptUtils';

const KNOWLEDGE_BASE_KEY = 'sat_learnedKnowledgeBase';
const REPAIR_HISTORY_KEY = 'sat_repairHistory';
const QUARANTINE_QUEUE_KEY = 'sat_quarantineQueue';
const AUDIT_LOG_KEY = 'sat_auditLog';
const PACKAGE_VERSION = '1.1.0';

// --- Local Data Management ---

export function saveLearnedKnowledgeBase(data: KnowledgeBaseEntry[]): void {
    try {
        localStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save learned knowledge base:", e);
    }
}

export function loadLearnedKnowledgeBase(): KnowledgeBaseEntry[] {
    try {
        const data = localStorage.getItem(KNOWLEDGE_BASE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load learned knowledge base:", e);
        return [];
    }
}

export function saveRepairHistory(data: RepairHistoryEntry[]): void {
    try {
        localStorage.setItem(REPAIR_HISTORY_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save repair history:", e);
    }
}

export function loadRepairHistory(): RepairHistoryEntry[] {
    try {
        const data = localStorage.getItem(REPAIR_HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load repair history:", e);
        return [];
    }
}

// --- Collaborative Sharing & Governance ---

export function exportMemory(): string {
    const knowledge = loadLearnedKnowledgeBase();
    const history = loadRepairHistory();
    const riskyScripts = history.filter(h => isRiskyScript(h.script)).length;
    
    const memoryPackage: MemoryPackage = {
        metadata: {
            exportedAt: Date.now(),
            version: PACKAGE_VERSION,
        },
        stats: {
            knowledgeEntries: knowledge.reduce((acc, curr) => acc + curr.errors.length, 0),
            historyEntries: history.length,
            riskyScripts,
        },
        learnedKnowledge: knowledge,
        repairHistory: history,
    };
    return JSON.stringify(memoryPackage, null, 2);
}

export function validateAndParseMemoryPackage(jsonString: string): MemoryPackage {
    const data = JSON.parse(jsonString);
    if (!data.metadata || !data.stats || !data.learnedKnowledge || !data.repairHistory) {
        throw new Error('Invalid memory package structure. Required fields are missing.');
    }
    if (data.metadata.version !== PACKAGE_VERSION) {
        console.warn(`Version mismatch. Expected ${PACKAGE_VERSION}, got ${data.metadata.version}. Proceeding with caution.`);
    }
    return data as MemoryPackage;
}

// --- Quarantine Management ---
export function loadQuarantinedPackages(): QuarantinedMemoryPackage[] {
    try {
        const data = localStorage.getItem(QUARANTINE_QUEUE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load quarantine queue:", e);
        return [];
    }
}

export function saveQuarantinedPackages(packages: QuarantinedMemoryPackage[]): void {
    try {
        localStorage.setItem(QUARANTINE_QUEUE_KEY, JSON.stringify(packages));
    } catch (e) {
        console.error("Failed to save quarantine queue:", e);
    }
}

export function addPackageToQuarantine(pkg: MemoryPackage): QuarantinedMemoryPackage {
    const packages = loadQuarantinedPackages();
    const newQuarantinedItem: QuarantinedMemoryPackage = {
        ...pkg,
        id: `pkg_${Date.now()}`,
        importDate: Date.now(),
        status: 'pending',
    };
    saveQuarantinedPackages([newQuarantinedItem, ...packages]);
    return newQuarantinedItem;
}

export function updateQuarantinePackageStatus(packageId: string, status: QuarantineStatus): QuarantinedMemoryPackage[] {
    const packages = loadQuarantinedPackages();
    const updatedPackages = packages.map(p => p.id === packageId ? { ...p, status } : p);
    saveQuarantinedPackages(updatedPackages);
    return updatedPackages;
}

// --- Merge Logic ---

interface MergeMemoryArgs {
    localKnowledge: KnowledgeBaseEntry[];
    localHistory: RepairHistoryEntry[];
    incomingPackage: MemoryPackage;
    strategy: MergeStrategy;
}

export function mergeMemory({ localKnowledge, localHistory, incomingPackage, strategy }: MergeMemoryArgs): { mergedKnowledge: KnowledgeBaseEntry[], mergedHistory: RepairHistoryEntry[] } {
    // Deep clone local data to avoid mutation issues
    const mergedKnowledge: KnowledgeBaseEntry[] = JSON.parse(JSON.stringify(localKnowledge));
    
    // Merge Knowledge Base
    incomingPackage.learnedKnowledge.forEach(incomingFramework => {
        const localFrameworkIndex = mergedKnowledge.findIndex(f => f.framework.toLowerCase() === incomingFramework.framework.toLowerCase());

        if (localFrameworkIndex === -1) {
            // Framework doesn't exist locally, add it completely
            mergedKnowledge.push(incomingFramework);
        } else {
            // Framework exists, merge error patterns
            incomingFramework.errors.forEach(incomingError => {
                const localErrorIndex = mergedKnowledge[localFrameworkIndex].errors.findIndex(e => e.error.toLowerCase() === incomingError.error.toLowerCase());
                
                if (localErrorIndex === -1) {
                    // Error doesn't exist, add it
                    mergedKnowledge[localFrameworkIndex].errors.push(incomingError);
                } else {
                    // Conflict: Error already exists
                    if (strategy === 'overwrite') {
                        mergedKnowledge[localFrameworkIndex].errors[localErrorIndex] = incomingError;
                    }
                    // If strategy is 'prefer-local', do nothing
                }
            });
        }
    });

    // Merge Repair History (simple deduplication by timestamp)
    const combinedHistory = [...localHistory, ...incomingPackage.repairHistory];
    const uniqueHistoryTimestamps = new Set<number>();
    const mergedHistory = combinedHistory.filter(entry => {
        if (uniqueHistoryTimestamps.has(entry.timestamp)) {
            return false;
        }
        uniqueHistoryTimestamps.add(entry.timestamp);
        return true;
    }).sort((a, b) => b.timestamp - a.timestamp); // Keep it sorted by most recent

    return { mergedKnowledge, mergedHistory };
}

// --- NEW: Audit & Rollback Logic ---

export function loadAuditLog(): AuditLogEntry[] {
    try {
        const data = localStorage.getItem(AUDIT_LOG_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load audit log:", e);
        return [];
    }
}

export function saveAuditLog(log: AuditLogEntry[]): void {
    try {
        localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(log));
    } catch (e) {
        console.error("Failed to save audit log:", e);
    }
}

export function logAuditEvent(
    action: AuditAction,
    pkg: QuarantinedMemoryPackage,
    details: AuditLogEntry['details'] = {}
): AuditLogEntry {
    const auditLog = loadAuditLog();
    const newEntry: AuditLogEntry = {
        id: `audit_${Date.now()}`,
        timestamp: Date.now(),
        action,
        packageId: pkg.id,
        packageStats: pkg.stats,
        details,
    };
    saveAuditLog([newEntry, ...auditLog]);
    return newEntry;
}

export function performRollback(auditIdToRollback: string) {
    const auditLog = loadAuditLog();
    const quarantine = loadQuarantinedPackages();

    const entryToRollback = auditLog.find(e => e.id === auditIdToRollback);

    if (!entryToRollback || entryToRollback.action !== 'approve' || !entryToRollback.details.snapshotBeforeMerge) {
        throw new Error("Invalid or non-rollbackable audit entry.");
    }

    const { knowledge, history } = entryToRollback.details.snapshotBeforeMerge;

    // 1. Restore the state from snapshot
    saveLearnedKnowledgeBase(knowledge);
    saveRepairHistory(history);

    // 2. Update the quarantine package status
    const updatedQuarantine = quarantine.map(p => p.id === entryToRollback.packageId ? { ...p, status: 'rolled-back' as QuarantineStatus } : p);
    saveQuarantinedPackages(updatedQuarantine);
    const rolledBackPackage = updatedQuarantine.find(p => p.id === entryToRollback.packageId)!;

    // 3. Log the rollback action
    const newAuditEntry = logAuditEvent('rollback', rolledBackPackage, { rolledBackFromAuditId: auditIdToRollback });
    
    return {
        restoredKnowledge: knowledge,
        restoredHistory: history,
        updatedQuarantine,
        updatedAuditLog: [newAuditEntry, ...auditLog]
    };
}