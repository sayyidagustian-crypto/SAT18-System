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
