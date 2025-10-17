import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ErrorAnalyzerTool } from './components/ErrorAnalyzerTool';
import { KnowledgeBase } from './components/KnowledgeBase';
import { RepairHistory } from './components/RepairHistory';
import { SectionCard } from './components/SectionCard';
import { CollaborativeSharing } from './components/CollaborativeSharing';
import { QuarantineQueue } from './components/QuarantineQueue';
import { AuditTrail } from './components/AuditTrail';
import { SmokeTestGuide } from './components/SmokeTestGuide';
import { ToastNotification } from './components/ToastNotification';
import { KNOWLEDGE_BASE_DATA } from './constants';
import * as localMemory from './services/localMemoryService';
import type { KnowledgeBaseEntry, AnalysisResult, RepairHistoryEntry, RepairScriptStatus, MemoryPackage, QuarantinedMemoryPackage, MergeStrategy, AuditLogEntry, StateSnapshot } from './types';
import { RobotIcon, KnowledgeIcon, HistoryIcon, InboxStackIcon, AuditIcon, TestTubeIcon, DeploymentIcon } from './components/CustomIcons';
import { DeploymentGuide } from './components/DeploymentGuide';

function App() {
    const [learnedKnowledge, setLearnedKnowledge] = useState<KnowledgeBaseEntry[]>([]);
    const [repairHistory, setRepairHistory] = useState<RepairHistoryEntry[]>([]);
    const [quarantinedPackages, setQuarantinedPackages] = useState<QuarantinedMemoryPackage[]>([]);
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
    const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
    const [progress, setProgress] = useState({ completed: 0, total: 0 });
    const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
    const prevCompletedRef = useRef(0);
    
    useEffect(() => {
        setLearnedKnowledge(localMemory.loadLearnedKnowledgeBase());
        setRepairHistory(localMemory.loadRepairHistory());
        setQuarantinedPackages(localMemory.loadQuarantinedPackages());
        setAuditLog(localMemory.loadAuditLog());
    }, []);

    const handleProgressUpdate = useCallback((completed: number, total: number) => {
        setProgress({ completed, total });
    }, []);
    
    useEffect(() => {
        if (progress.completed > 0 && progress.completed > prevCompletedRef.current) {
            const messages = [
                "Great progress!",
                "Checklist updated.",
                "Nice one!",
                "Keep it up!",
                "Test case passed!",
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            setToast({ show: true, message: `${message} (${progress.completed}/${progress.total})` });
        }
        prevCompletedRef.current = progress.completed;
    }, [progress]);

    const handleAddToKnowledgeBase = useCallback((newDiscovery: AnalysisResult) => {
        setLearnedKnowledge(prevLearned => {
            const frameworkIndex = prevLearned.findIndex(
                entry => entry.framework.toLowerCase() === newDiscovery.framework.toLowerCase()
            );

            let newLearnedKnowledge: KnowledgeBaseEntry[];

            if (frameworkIndex > -1) {
                newLearnedKnowledge = prevLearned.map((entry, index) => {
                    if (index === frameworkIndex) {
                        if (entry.errors.some(e => e.error === newDiscovery.match)) return entry;
                        return { ...entry, errors: [...entry.errors, { error: newDiscovery.match, solution: newDiscovery.solution }] };
                    }
                    return entry;
                });
            } else {
                const newEntry: KnowledgeBaseEntry = {
                    framework: newDiscovery.framework,
                    icon: () => <RobotIcon className="h-6 w-6 mr-3 text-sat-accent" />,
                    errors: [{ error: newDiscovery.match, solution: newDiscovery.solution }]
                };
                newLearnedKnowledge = [...prevLearned, newEntry];
            }
            
            localMemory.saveLearnedKnowledgeBase(newLearnedKnowledge);
            setHighlightedItem(newDiscovery.match);
            setTimeout(() => setHighlightedItem(null), 3000);
            
            return newLearnedKnowledge;
        });
    }, []);

    const handleAddScriptToHistory = useCallback((entry: Omit<RepairHistoryEntry, 'timestamp' | 'status'>) => {
        setRepairHistory(prevHistory => {
            const newEntry: RepairHistoryEntry = { ...entry, timestamp: Date.now(), status: 'pending' };
            const updatedHistory = [newEntry, ...prevHistory];
            localMemory.saveRepairHistory(updatedHistory);
            return updatedHistory;
        });
    }, []);

    const handleUpdateStatus = useCallback((timestamp: number, status: RepairScriptStatus) => {
        setRepairHistory(prevHistory => {
            const updatedHistory = prevHistory.map(entry => entry.timestamp === timestamp ? { ...entry, status } : entry);
            localMemory.saveRepairHistory(updatedHistory);
            return updatedHistory;
        });
    }, []);
    
    const handleClearHistory = useCallback(() => {
        if (window.confirm("Are you sure? This will delete the entire repair history.")) {
            setRepairHistory([]);
            localMemory.saveRepairHistory([]);
        }
    }, []);

    // --- Governance Handlers ---
    const handlePackageImport = useCallback((pkg: MemoryPackage) => {
        const newQuarantinedItem = localMemory.addPackageToQuarantine(pkg);
        setQuarantinedPackages(prev => [newQuarantinedItem, ...prev]);
        const auditEntry = localMemory.logAuditEvent('import', newQuarantinedItem);
        setAuditLog(prev => [auditEntry, ...prev]);
    }, []);

    const handleApprovePackage = useCallback((packageId: string, strategy: MergeStrategy) => {
        const pkg = quarantinedPackages.find(p => p.id === packageId);
        if (!pkg) return;

        // Create snapshot BEFORE merging
        const snapshotBeforeMerge: StateSnapshot = {
            knowledge: JSON.parse(JSON.stringify(learnedKnowledge)),
            history: JSON.parse(JSON.stringify(repairHistory)),
        };

        const { mergedKnowledge, mergedHistory } = localMemory.mergeMemory({
            localKnowledge: learnedKnowledge,
            localHistory: repairHistory,
            incomingPackage: pkg,
            strategy,
        });

        setLearnedKnowledge(mergedKnowledge);
        localMemory.saveLearnedKnowledgeBase(mergedKnowledge);

        setRepairHistory(mergedHistory);
        localMemory.saveRepairHistory(mergedHistory);

        const updatedQuarantine = localMemory.updateQuarantinePackageStatus(packageId, 'approved');
        setQuarantinedPackages(updatedQuarantine);
        
        const approvedPackage = updatedQuarantine.find(p => p.id === packageId)!;
        const auditEntry = localMemory.logAuditEvent('approve', approvedPackage, { mergeStrategy: strategy, snapshotBeforeMerge });
        setAuditLog(prev => [auditEntry, ...prev]);

    }, [learnedKnowledge, repairHistory, quarantinedPackages]);
    
    const handleRejectPackage = useCallback((packageId: string) => {
        const updatedQuarantine = localMemory.updateQuarantinePackageStatus(packageId, 'rejected');
        setQuarantinedPackages(updatedQuarantine);
        
        const rejectedPackage = updatedQuarantine.find(p => p.id === packageId)!;
        const auditEntry = localMemory.logAuditEvent('reject', rejectedPackage);
        setAuditLog(prev => [auditEntry, ...prev]);
    }, []);

    const handleRollback = useCallback((auditId: string) => {
        if (!window.confirm("Are you sure you want to roll back this merge? This will revert the knowledge base and repair history to the state before this package was approved.")) {
            return;
        }
        try {
            const { restoredKnowledge, restoredHistory, updatedQuarantine, updatedAuditLog } = localMemory.performRollback(auditId);
            setLearnedKnowledge(restoredKnowledge);
            setRepairHistory(restoredHistory);
            setQuarantinedPackages(updatedQuarantine);
            setAuditLog(updatedAuditLog);
        } catch(e) {
            console.error(e);
            alert("Rollback failed. See console for details.");
        }
    }, []);

    const handleResetState = useCallback(() => {
        if (window.confirm("RESET ALL APP DATA? This is irreversible and will clear the knowledge base, history, quarantine, audit logs, AND all smoke test progress.")) {
            localStorage.clear();
            sessionStorage.clear(); // This clears the smoke test progress
            // Force a reload to ensure all state, including from sessionStorage, is cleared and re-initialized.
            window.location.reload();
        }
    }, []);
    
    const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

    return (
        <div className="bg-sat-darkblue min-h-screen text-sat-lightgray p-4 sm:p-6 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-sat-white mb-2">
                        SAT18 Final Validation
                    </h1>
                    <p className="text-lg text-sat-accent">
                        End-to-End Smoke Test Execution Sheet
                    </p>
                    <div className="mt-6 max-w-lg mx-auto">
                        <div className="flex justify-between items-center text-sm font-bold mb-1">
                            <span className="text-sat-white">Test Progress</span>
                            <span className="text-sat-accent">{progress.completed} / {progress.total} Completed</span>
                        </div>
                        <div className="w-full bg-sat-blue rounded-full h-2.5 border border-sat-gray">
                            <div className="bg-sat-accent h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </header>

                <main className="space-y-6">
                    <SectionCard title="Execution Guide & Checklist" icon={TestTubeIcon} startOpen={true}>
                       <SmokeTestGuide onResetState={handleResetState} onProgressUpdate={handleProgressUpdate} />
                    </SectionCard>
                    
                    <SectionCard title="Log Analyzer & Repair Assistant" icon={RobotIcon} startOpen={true}>
                        <ErrorAnalyzerTool 
                            knowledgeBase={[...KNOWLEDGE_BASE_DATA, ...learnedKnowledge]}
                            repairHistory={repairHistory}
                            onAddToKnowledgeBase={handleAddToKnowledgeBase}
                            onAddScriptToHistory={handleAddScriptToHistory}
                        />
                    </SectionCard>
                    
                    <SectionCard title="Collaborative Sharing & Governance" icon={InboxStackIcon} startOpen={true}>
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-sat-white -mb-2">Quarantine Queue</h3>
                            <QuarantineQueue
                                packages={quarantinedPackages}
                                onApprove={handleApprovePackage}
                                onReject={handleRejectPackage}
                            />
                             <div className="pt-6 border-t border-dashed border-sat-gray">
                                 <CollaborativeSharing onPackageImport={handlePackageImport} />
                             </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Audit Trail & Rollback" icon={AuditIcon}>
                        <AuditTrail log={auditLog} onRollback={handleRollback} />
                    </SectionCard>

                    <SectionCard title="Knowledge Base" icon={KnowledgeIcon}>
                        <KnowledgeBase
                            staticData={KNOWLEDGE_BASE_DATA}
                            learnedData={learnedKnowledge}
                            highlightedItem={highlightedItem}
                        />
                    </SectionCard>

                    <SectionCard title="Repair Script History" icon={HistoryIcon}>
                        <RepairHistory
                            history={repairHistory}
                            onClearHistory={handleClearHistory}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    </SectionCard>

                    <SectionCard title="Final Deployment Guide" icon={DeploymentIcon}>
                        <DeploymentGuide />
                    </SectionCard>
                </main>
                
                <footer className="text-center text-sat-gray text-sm pt-4">
                    <p>Powered by Gemini. Built for speed and accuracy.</p>
                </footer>
            </div>
             <ToastNotification 
                show={toast.show} 
                message={toast.message}
                onClose={() => setToast(t => ({ ...t, show: false }))}
            />
        </div>
    );
}

export default App;