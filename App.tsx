import React, { useState, useEffect, useCallback } from 'react';
import { ErrorAnalyzerTool } from './components/ErrorAnalyzerTool';
import { KnowledgeBase } from './components/KnowledgeBase';
import { KNOWLEDGE_BASE_DATA } from './constants';
import { getLearnedKnowledge, addResultToKnowledge } from './services/localMemoryService';
import type { AnalysisResult, KnowledgeBaseEntry } from './types';

const App: React.FC = () => {
    const [learnedKnowledge, setLearnedKnowledge] = useState<KnowledgeBaseEntry[]>([]);
    const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

    const refreshLearnedKnowledge = useCallback(() => {
        setLearnedKnowledge(getLearnedKnowledge());
    }, []);

    useEffect(() => {
        refreshLearnedKnowledge();
    }, [refreshLearnedKnowledge]);

    const handleAddToKnowledgeBase = (result: AnalysisResult) => {
        addResultToKnowledge(result);
        refreshLearnedKnowledge();
        setHighlightedItem(result.match);

        // Clear the highlight after the animation is expected to finish
        setTimeout(() => {
            setHighlightedItem(null);
        }, 2000); // Should match the CSS animation duration
    };
    
    const allKnowledge = [...KNOWLEDGE_BASE_DATA, ...learnedKnowledge];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-sat-blue font-sans">
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-sat-white mb-2">
                    SAT18 Error Analyzer v2.0
                </h1>
                <p className="text-lg text-sat-lightgray">
                    Your intelligent assistant for debugging build & deployment issues.
                </p>
            </header>
            <main className="w-full max-w-4xl space-y-12">
                <ErrorAnalyzerTool 
                    knowledgeBase={allKnowledge}
                    onAddToKnowledgeBase={handleAddToKnowledgeBase}
                />
                <KnowledgeBase 
                    staticData={KNOWLEDGE_BASE_DATA}
                    learnedData={learnedKnowledge}
                    highlightedItem={highlightedItem}
                />
            </main>
            <footer className="text-center mt-12 text-sat-gray">
                <p>&copy; 2024 SAT18 Independent Deployment System. Built for focus and function.</p>
            </footer>
        </div>
    );
};

export default App;