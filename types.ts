import type React from 'react';

export interface AnalysisResult {
    match: string;
    solution: string;
    framework: string;
}

export interface ErrorPattern {
    error: string;
    solution: string;
}

export interface KnowledgeBaseEntry {
    framework: string;
    icon: React.ComponentType<{ className?: string }>;
    errors: ErrorPattern[];
}

export type RepairScriptStatus = 'success' | 'failed' | 'pending';

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

// --- Types for Collaborative Sharing & Governance ---

export type MergeStrategy = 'prefer-local' | 'overwrite';

export interface MemoryPackageMetadata {
    exportedAt: number;
    version: string;
}

export interface MemoryPackageStats {
    knowledgeEntries: number;
    historyEntries: number;
    riskyScripts: number;
}

export interface MemoryPackage {
    metadata: MemoryPackageMetadata;
    stats: MemoryPackageStats;
    learnedKnowledge: KnowledgeBaseEntry[];
    repairHistory: RepairHistoryEntry[];
}

export type QuarantineStatus = 'pending' | 'approved' | 'rejected' | 'rolled-back';
export interface QuarantinedMemoryPackage extends MemoryPackage {
    id: string;
    importDate: number;
    status: QuarantineStatus;
}

// --- NEW: Types for Audit & Rollback ---

export type AuditAction = 'import' | 'approve' | 'reject' | 'rollback';

export interface StateSnapshot {
    knowledge: KnowledgeBaseEntry[];
    history: RepairHistoryEntry[];
}

export interface AuditLogEntry {
    id: string;
    timestamp: number;
    action: AuditAction;
    packageId: string;
    packageStats: MemoryPackageStats;
    details: {
        mergeStrategy?: MergeStrategy;
        rolledBackFromAuditId?: string;
        snapshotBeforeMerge?: StateSnapshot;
    };
}