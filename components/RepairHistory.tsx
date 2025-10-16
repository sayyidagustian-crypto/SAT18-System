import React from 'react';
import type { RepairHistoryEntry, RepairScriptStatus } from '../types';
import { CodeBlock } from './CodeBlock';
import { isRiskyScript } from '../utils/scriptUtils';

interface RepairHistoryProps {
    history: RepairHistoryEntry[];
    onClearHistory: () => void;
    onUpdateStatus: (timestamp: number, status: RepairScriptStatus) => void;
}

const ThumbsUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23,10C23,8.9,22.1,8,21,8H14.68L15.64,3.43C15.66,3.33,15.67,3.22,15.67,3.11C15.67,2.7,15.5,2.32,15.23,2.05L14.17,1L7.59,7.58C7.22,7.95,7,8.45,7,9V19A2,2,0,0,0,9,21H18C18.83,21,19.54,20.5,19.84,19.78L22.86,12.73C22.95,12.5,23,12.26,23,12V10Z"/>
    </svg>
);

const ThumbsDownIcon: React.FC<{className?: string}> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M1,14A2,2,0,0,1,3,12H9.32L8.36,17.57C8.34,17.67,8.33,17.78,8.33,17.89C8.33,18.3,8.5,18.68,8.77,18.95L9.83,20L16.41,13.42C16.78,13.05,17,12.55,17,12V2A2,2,0,0,0,15,0H6C5.17,0,4.46,0.5,4.16,1.22L1.14,8.27C1.05,8.5,1,8.74,1,9V11C1,12.1,1.9,13,3,13H3.05L1,14Z"/>
    </svg>
);

export const RepairHistory: React.FC<RepairHistoryProps> = ({ history, onClearHistory, onUpdateStatus }) => {
    
    if (history.length === 0) {
        return (
            <div className="text-center p-4 text-sat-lightgray rounded-lg bg-sat-blue">
                <p>No repair scripts have been generated yet. Your history will appear here.</p>
            </div>
        );
    }

    const formatTimestamp = (timestamp: number) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffSeconds < 60) return `${diffSeconds}s ago`;
        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return past.toLocaleDateString();
    };

    const getStatusBorderColor = (status: RepairScriptStatus) => {
        switch(status) {
            case 'success': return 'border-green-500/60';
            case 'failed': return 'border-red-500/60';
            default: return 'border-sat-gray/50';
        }
    };

    return (
        <div>
            {history.map((item) => (
                <div key={item.timestamp} className={`bg-sat-blue p-4 rounded-lg border mb-3 animate-fade-in transition-colors ${getStatusBorderColor(item.status)}`}>
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-mono text-red-400 text-sm">
                            For Error: <span className="font-semibold">{item.match}</span>
                        </p>
                        <p className="text-xs text-sat-lightgray">{formatTimestamp(item.timestamp)}</p>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                            <CodeBlock script={item.script} isRisky={isRiskyScript(item.script)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => onUpdateStatus(item.timestamp, 'success')}
                                className={`p-2 rounded-md transition-colors ${item.status === 'success' ? 'bg-green-500/30 text-green-400' : 'bg-sat-gray/50 text-sat-lightgray hover:bg-green-500/20 hover:text-green-400'}`}
                                aria-label="Mark as successful"
                            >
                                <ThumbsUpIcon className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onUpdateStatus(item.timestamp, 'failed')}
                                 className={`p-2 rounded-md transition-colors ${item.status === 'failed' ? 'bg-red-500/30 text-red-400' : 'bg-sat-gray/50 text-sat-lightgray hover:bg-red-500/20 hover:text-red-400'}`}
                                aria-label="Mark as failed"
                            >
                                <ThumbsDownIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="text-center mt-4">
                <button 
                    onClick={onClearHistory}
                    className="px-4 py-1 text-sm text-sat-lightgray hover:text-red-400 hover:bg-red-900/30 rounded-md transition-colors"
                >
                    Clear History
                </button>
            </div>
        </div>
    );
};