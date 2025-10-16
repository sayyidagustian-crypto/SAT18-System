// FIX: Add a shared type definition for analysis results.
export interface AnalysisResult {
  match: string;
  solution: string;
  framework: string;
}

export interface FrameworkError {
  error: string;
  solution: string;
}

export interface KnowledgeBaseEntry {
  framework: string;
  icon?: React.ComponentType<{ className?: string }>;
  errors: FrameworkError[];
}

export type RepairScriptStatus = 'success' | 'failed' | 'unknown';

export interface RepairHistoryEntry {
  match: string;
  script: string;
  timestamp: number;
  status: RepairScriptStatus;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ConfidenceDetails {
  level: ConfidenceLevel;
  successCount: number;
  failCount: number;
  total: number;
}
