import type { RepairHistoryEntry } from '../types';

// This is a placeholder for future analytics features.
// It is not currently used in the application.

export function getSuccessRate(history: RepairHistoryEntry[]): number {
    if (history.length === 0) {
        return 0;
    }
    const successful = history.filter(h => h.status === 'success').length;
    return (successful / history.length) * 100;
}
