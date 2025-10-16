import React from 'react';

export interface FrameworkError {
    error: string;
    solution: string;
}

export interface KnowledgeBaseEntry {
    framework: string;
    icon: React.ComponentType<{ className?: string }>;
    errors: FrameworkError[];
}

export interface AnalysisResult {
    match: string;
    solution: string;
    framework: string;
}

export type RepairScriptStatus = 'success' | 'failed' | 'unknown';

export interface RepairHistoryEntry {
    timestamp: number;
    match: string;
    script: string;
    status: RepairScriptStatus;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ConfidenceDetails {
    level: ConfidenceLevel;
    successCount: number;
    failCount: number;
    total: number;
}

export interface MemoryExport {
    version: number;
    exportedAt: string;
    data: {
        learnedKnowledge: KnowledgeBaseEntry[];
        repairHistory: RepairHistoryEntry[];
    };
}
