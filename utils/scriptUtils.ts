import type { RepairHistoryEntry, ConfidenceDetails, ConfidenceLevel } from '../types';

// Patterns to identify potentially destructive or system-altering commands.
const RISKY_COMMAND_PATTERNS: RegExp[] = [
    /\bsudo\b/,                  // Use of superuser privileges
    /chmod\s+(-R\s+)?(777|666)/, // Overly permissive file permissions
    /\bdocker\s+system\s+prune/,  // Potentially destructive Docker command
    /\brm\s+(-rf|-fr)/,          // Forceful recursive deletion
    /dd\s+if=/,                  // Direct disk writing
    /mkfs\./,                    // Formatting a filesystem
    />\s*\/dev\/sd/,              // Writing directly to a disk device
];

/**
 * Checks if a script contains potentially risky commands.
 * @param script The bash script to check.
 * @returns true if a risky pattern is found, false otherwise.
 */
export function isRiskyScript(script: string): boolean {
    if (!script) return false;
    return RISKY_COMMAND_PATTERNS.some(pattern => pattern.test(script));
}

/**
 * Calculates confidence statistics for a given error match based on repair history.
 * @param match The error pattern string.
 * @param history The complete repair history.
 * @returns An object with success/fail counts, total attempts, and a confidence level.
 */
export function getConfidenceDetails(match: string, history: RepairHistoryEntry[]): ConfidenceDetails {
    const relevantHistory = history.filter(entry => entry.match.toLowerCase() === match.toLowerCase());
    const successCount = relevantHistory.filter(entry => entry.status === 'success').length;
    const failCount = relevantHistory.filter(entry => entry.status === 'failed').length;
    const total = successCount + failCount;

    let level: ConfidenceLevel = 'low';
    if (total > 0) {
        const successRatio = successCount / total;
        if (successCount >= 3 && successRatio >= 0.7) {
            level = 'high';
        } else if (successCount > 0) {
            level = 'medium';
        }
    }

    return { level, successCount, failCount, total };
}
