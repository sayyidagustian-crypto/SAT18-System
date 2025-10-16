import React from 'react';
import type { RepairHistoryEntry, RepairScriptStatus } from '../types';
import { CodeBlock } from './CodeBlock';
import { isRiskyScript, getConfidenceDetails } from '../utils/scriptUtils';

interface RepairHistoryProps {
    history: RepairHistoryEntry[];
    onClearHistory: () => void;
    onUpdateStatus: (timestamp: number, status: RepairScriptStatus) => void;
}

const ThumbsUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.367a3 3 0 00-1.341-.317H4.25a1.25 1.25 0 01-1.25-1.25v-7.5a1.25 1.25 0 011.25-1.25h2.5a3 3 0 001.341-.317l2.734-1.367A3 3 0 0111 3z" />
    </svg>
);

const ThumbsDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path d="M1 11.75a1.25 1.25 0 102.5 0v-7.5a1.25 1.25 0 10-2.5 0v7.5zM11 17V18.3c0 .268.14.526.395.607A2 2 0 0014 17c0-.995-.182-1.948-.514-2.826-.204-.54.166-1.174.744-1.174h2.52c1.243 0 2.261-1.01 2.146-2.247a23.864 23.864 0 00-1.341-5.974C17.153 3.677 16.072 3 14.9 3h-3.192a3 3 0 00-1.341.317l-2.734 1.367a3 3 0 01-1.341.317H4.25a1.25 1.25 0 00-1.25 1.25v7.5a1.25 1.25 0 001.25 1.25h2.5a3 3 0 011.341.317l2.734 1.367A3 3 0 0011 17z" />
    </svg>
);

const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);

export const RepairHistory: React.FC<RepairHistoryProps> = ({ history, onClearHistory, onUpdateStatus }) => {

    if (history.length === 0) {
        return <p className="text-center text-sat-lightgray">No repair scripts have been generated yet.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="text-right">
                <button 
                    onClick={onClearHistory}
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-red-800/50 text-red-300 font-semibold rounded-md hover:bg-red-800/80 transition-colors"
                >
                    <TrashIcon className="h-4 w-4" />
                    Clear History
                </button>
            </div>
            {history.map(entry => (
                <div key={entry.timestamp} className="bg-sat-blue p-4 rounded-lg border border-sat-gray/50 animate-fade-in">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                             <p className="font-mono text-sm text-red-400">
                                <span className="font-bold text-sat-lightgray">Error:</span> {entry.match}
                            </p>
                            <p className="text-xs text-sat-gray">
                                {new Date(entry.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                            <button 
                                onClick={() => onUpdateStatus(entry.timestamp, 'success')}
                                className={`p-1.5 rounded-full transition-colors ${entry.status === 'success' ? 'bg-green-500/80 text-white' : 'bg-sat-gray text-sat-lightgray hover:bg-green-500/60'}`}
                                aria-label="Mark as successful"
                                title="Mark as successful"
                            >
                                <ThumbsUpIcon className="h-4 w-4" />
                            </button>
                             <button 
                                onClick={() => onUpdateStatus(entry.timestamp, 'failed')}
                                className={`p-1.5 rounded-full transition-colors ${entry.status === 'failed' ? 'bg-red-500/80 text-white' : 'bg-sat-gray text-sat-lightgray hover:bg-red-500/60'}`}
                                aria-label="Mark as failed"
                                title="Mark as failed"
                            >
                                <ThumbsDownIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <CodeBlock 
                        script={entry.script} 
                        isRisky={isRiskyScript(entry.script)} 
                        confidenceDetails={getConfidenceDetails(entry.match, history)}
                    />
                </div>
            ))}
        </div>
    );
};
