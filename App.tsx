import React, { useState, useEffect, useCallback } from 'react';
import { ErrorAnalyzerTool } from './components/ErrorAnalyzerTool';
import { KnowledgeBase } from './components/KnowledgeBase';
import { RepairHistory } from './components/RepairHistory';
import { ProgressTracker } from './components/ProgressTracker';
import { SectionCard } from './components/SectionCard';
import { KNOWLEDGE_BASE_DATA } from './constants';
import { getLearnedKnowledge, addResultToKnowledge, getRepairHistory, addScriptToHistory, clearRepairHistory, updateScriptStatus } from './services/localMemoryService';
import type { AnalysisResult, KnowledgeBaseEntry, RepairHistoryEntry, RepairScriptStatus } from './types';
import { RobotIcon, HistoryIcon, BrainIcon, RoadmapIcon } from './components/CustomIcons';

const App: React.FC = () => {
    const [learnedKnowledge, setLearnedKnowledge] = useState<KnowledgeBaseEntry[]>([]);
    const [repairHistory, setRepairHistory] = useState<RepairHistoryEntry[]>([]);
    const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

    const refreshLearnedKnowledge = useCallback(() => {
        setLearnedKnowledge(getLearnedKnowledge());
    }, []);

    const refreshRepairHistory = useCallback(() => {
        setRepairHistory(getRepairHistory());
    }, []);

    useEffect(() => {
        refreshLearnedKnowledge();
        refreshRepairHistory();
    }, [refreshLearnedKnowledge, refreshRepairHistory]);

    const handleAddToKnowledgeBase = (result: AnalysisResult) => {
        addResultToKnowledge(result);
        refreshLearnedKnowledge();
        setHighlightedItem(result.match);

        setTimeout(() => {
            setHighlightedItem(null);
        }, 2000);
    };

    const handleAddScriptToHistory = (entry: Omit<RepairHistoryEntry, 'timestamp' | 'status'>) => {
        addScriptToHistory(entry);
        refreshRepairHistory();
    };

    const handleUpdateScriptStatus = (timestamp: number, status: RepairScriptStatus) => {
        updateScriptStatus(timestamp, status);
        refreshRepairHistory();
    };

    const handleClearHistory = () => {
        clearRepairHistory();
        refreshRepairHistory();
    };
    
    const allKnowledge = [...KNOWLEDGE_BASE_DATA, ...learnedKnowledge];

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-sat-blue font-sans">
            <header className="text-center my-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-sat-white mb-2">
                    SAT18 Evolution
                </h1>
                <p className="text-lg text-sat-lightgray">
                    Your intelligent partner in system deployment and self-healing.
                </p>
            </header>
            <main className="w-full max-w-4xl space-y-8">
                <SectionCard title="System Roadmap" icon={RoadmapIcon} startOpen={true}>
                    <ProgressTracker />
                </SectionCard>
                
                <SectionCard title="Error Analyzer" icon={RobotIcon} startOpen={true}>
                    <ErrorAnalyzerTool 
                        knowledgeBase={allKnowledge}
                        repairHistory={repairHistory}
                        onAddToKnowledgeBase={handleAddToKnowledgeBase}
                        onAddScriptToHistory={handleAddScriptToHistory}
                    />
                </SectionCard>

                <SectionCard title="Repair Script History" icon={HistoryIcon} startOpen={repairHistory.length > 0}>
                    <RepairHistory 
                        history={repairHistory}
                        onClearHistory={handleClearHistory}
                        onUpdateStatus={handleUpdateScriptStatus}
                    />
                </SectionCard>

                <SectionCard title="System Knowledge Base" icon={BrainIcon}>
                     <KnowledgeBase 
                        staticData={KNOWLEDGE_BASE_DATA}
                        learnedData={learnedKnowledge}
                        highlightedItem={highlightedItem}
                    />
                </SectionCard>
            </main>
            <footer className="text-center mt-12 mb-6 text-sat-gray">
                <p>&copy; 2024 SAT18 Independent Deployment System. Built for focus and function.</p>
            </footer>
        </div>
    );
};

export default App;