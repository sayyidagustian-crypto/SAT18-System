import React from 'react';
import type { AuditLogEntry } from '../types';
import { RobotIcon, InboxStackIcon, UndoIcon, ShieldCheckIcon, ArrowPathIcon } from './CustomIcons';

interface AuditTrailProps {
    log: AuditLogEntry[];
    onRollback: (auditId: string) => void;
}

const actionDetails = {
    import: { icon: InboxStackIcon, color: 'text-blue-400', text: 'Package Imported' },
    approve: { icon: ShieldCheckIcon, color: 'text-green-400', text: 'Package Approved & Merged' },
    reject: { icon: RobotIcon, color: 'text-red-400', text: 'Package Rejected' },
    rollback: { icon: UndoIcon, color: 'text-yellow-400', text: 'Merge Rolled Back' },
};

export const AuditTrail: React.FC<AuditTrailProps> = ({ log, onRollback }) => {
    
    if (log.length === 0) {
        return <p className="text-center text-sat-lightgray">No governance actions have been recorded yet.</p>;
    }
    
    // Check if any merge has been rolled back
    const rolledBackAuditIds = new Set(log.filter(e => e.action === 'rollback').map(e => e.details.rolledBackFromAuditId));

    return (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {log.map(entry => {
                const details = actionDetails[entry.action];
                const Icon = details.icon;
                const isRolledBack = rolledBackAuditIds.has(entry.id);

                return (
                    <div key={entry.id} className={`p-3 rounded-lg border animate-fade-in ${isRolledBack ? 'bg-sat-gray/20 border-sat-gray/40' : 'bg-sat-blue border-sat-gray/50'}`}>
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex items-start gap-3">
                                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${details.color}`} />
                                <div>
                                    <p className={`font-bold ${details.color}`}>
                                        {details.text}
                                        {isRolledBack && <span className="text-yellow-400 font-normal"> (Rolled Back)</span>}
                                    </p>
                                    <p className="text-xs text-sat-lightgray font-mono">Pkg ID: {entry.packageId}</p>
                                    <p className="text-xs text-sat-gray">{new Date(entry.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            
                            {entry.action === 'approve' && !isRolledBack && (
                                <button
                                    onClick={() => onRollback(entry.id)}
                                    className="flex items-center gap-1.5 px-3 py-1 text-xs bg-yellow-800/60 text-yellow-200 font-semibold rounded-md hover:bg-yellow-700 transition-colors"
                                    title="Rollback this merge action"
                                >
                                    <UndoIcon className="h-4 w-4" />
                                    Rollback
                                </button>
                            )}
                        </div>
                        {entry.action === 'approve' && (
                            <div className="mt-2 pl-8 text-xs text-sat-lightgray flex items-center gap-1.5">
                                {entry.details.mergeStrategy === 'overwrite' ? <ArrowPathIcon className="h-3 w-3" /> : <ShieldCheckIcon className="h-3 w-3" />}
                                <span>Strategy: <span className="font-semibold">{entry.details.mergeStrategy === 'overwrite' ? 'Overwrite' : 'Prefer Local'}</span></span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};