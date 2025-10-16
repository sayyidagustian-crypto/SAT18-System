import React, { useState, useEffect } from 'react';
import { analyzeLog } from '../services/analyzerService';
import type { AnalysisResult, KnowledgeBaseEntry } from '../types';
import { isKnownError } from '../utils/knowledgeUtils';

interface ErrorAnalyzerToolProps {
    knowledgeBase: KnowledgeBaseEntry[];
    onAddToKnowledgeBase: (result: AnalysisResult) => void;
}

const RobotIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12,2A2,2,0,0,0,10,4V6H4A2,2,0,0,0,2,8V14H4V20A2,2,0,0,0,6,22H18A2,2,0,0,0,20,20V14H22V8A2,2,0,0,0,20,6H14V4A2,2,0,0,0,12,2ZM8,14V18H6V14ZM18,18H16V14H18Z" />
        <circle cx="8.5" cy="11.5" r="1.5" />
        <circle cx="15.5" cy="11.5" r="1.5" />
    </svg>
);


export const ErrorAnalyzerTool: React.FC<ErrorAnalyzerToolProps> = ({ knowledgeBase, onAddToKnowledgeBase }) => {
    const [logContent, setLogContent] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult[] | null>(null);
    const [newDiscoveries, setNewDiscoveries] = useState<AnalysisResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
    const [fadingOutItems, setFadingOutItems] = useState<Set<string>>(new Set());


    useEffect(() => {
        // Reset discoveries when knowledge base is updated (after adding an item)
        // This will run after an item has been successfully added and faded out.
        const updatedDiscoveries = newDiscoveries.filter(d => !isKnownError(d, knowledgeBase));
        
        // Only update state if the list has actually changed to prevent infinite loops
        if (updatedDiscoveries.length !== newDiscoveries.length) {
             setNewDiscoveries(updatedDiscoveries);
        }
        // We only want this to run when the knowledgebase changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [knowledgeBase]);


    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalyzed(true);
        setError(null);
        setAnalysisResult(null);
        setNewDiscoveries([]);
        setAddedItems(new Set());
        setFadingOutItems(new Set());

        try {
            const results = await analyzeLog(logContent);
            const knownResults = results.filter(r => isKnownError(r, knowledgeBase));
            const unknownResults = results.filter(r => !isKnownError(r, knowledgeBase));
            
            setAnalysisResult(knownResults);
            setNewDiscoveries(unknownResults);

        } catch (e) {
            console.error(e);
            setError("An unexpected error occurred. Please try again.");
            setAnalysisResult(null);
            setNewDiscoveries([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDiscovery = (discovery: AnalysisResult) => {
        setAddedItems(prev => new Set(prev).add(discovery.match));
        setFadingOutItems(prev => new Set(prev).add(discovery.match));
        
        // Wait for the fade-out animation to complete before updating the state
        setTimeout(() => {
            onAddToKnowledgeBase(discovery);
        }, 500); // This duration should match the CSS transition duration
    };

    const getFrameworkChipColor = (framework: string) => {
        switch (framework.toLowerCase().split(' ')[0]) {
            case 'node.js':
            case 'node': return 'bg-green-800 text-green-200';
            case 'react': return 'bg-blue-800 text-blue-200';
            case 'laravel': return 'bg-red-800 text-red-200';
            case 'docker': return 'bg-sky-800 text-sky-200';
            default: return 'bg-sat-gray text-sat-white';
        }
    };

    return (
        <div className="bg-sat-lightblue p-6 sm:p-8 rounded-xl shadow-2xl border border-sat-gray w-full">
            <label htmlFor="log-input" className="block text-lg font-semibold text-sat-white mb-2">
                Paste your build log here:
            </label>
            <textarea
                id="log-input"
                className="w-full h-64 bg-sat-blue text-sat-lightgray p-4 rounded-lg border-2 border-sat-gray focus:border-sat-accent focus:ring-2 focus:ring-sat-accent/50 transition-colors duration-200 font-mono text-sm"
                placeholder="e.g., Error: Cannot find module 'express'..."
                value={logContent}
                onChange={(e) => setLogContent(e.target.value)}
                aria-label="Build log input"
            ></textarea>
            <div className="text-center mt-6">
                <button
                    onClick={handleAnalyze}
                    disabled={!logContent || isLoading}
                    className="px-8 py-3 bg-sat-accent text-sat-blue font-bold rounded-lg shadow-lg hover:bg-sky-400 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sat-blue mr-3"></div>
                            <span>Analyzing...</span>
                        </div>
                    ) : (
                        'Analyze Log'
                    )}
                </button>
            </div>

            {analyzed && !isLoading && (
                 <div className="mt-8 pt-6 border-t border-sat-gray">
                    <h3 className="text-2xl font-bold text-sat-white mb-4 text-center">Analysis Results</h3>
                    {error && (
                        <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">
                            <p className="font-semibold">{error}</p>
                        </div>
                    )}
                    
                    {analysisResult && analysisResult.length > 0 && (
                        <div className="space-y-4">
                            {analysisResult.map((result, index) => (
                                <div key={index} className="bg-sat-blue p-4 rounded-lg border border-sat-gray/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-mono text-red-400 text-sm">
                                            <span className="font-bold">Pattern Matched:</span> {result.match}
                                        </p>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getFrameworkChipColor(result.framework)}`}>
                                            {result.framework}
                                        </span>
                                    </div>
                                    <p className="text-sat-white">
                                        <span className="text-sat-accent font-semibold mr-2">💡 Suggestion:</span>
                                        {result.solution}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {newDiscoveries.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-dashed border-sat-accent/30">
                             <div className="text-xl font-bold text-sat-accent mb-3 text-center flex items-center justify-center gap-2">
                                 <RobotIcon className="h-6 w-6" />
                                 <h4>New Discoveries!</h4>
                             </div>
                             <div className="space-y-4">
                                {newDiscoveries.map((discovery, index) => {
                                    const isAdded = addedItems.has(discovery.match);
                                    const isFadingOut = fadingOutItems.has(discovery.match);
                                    return (
                                        <div 
                                            key={index} 
                                            className={`bg-sky-900/40 p-4 rounded-lg border border-sat-accent/50 transition-all ease-in-out duration-500 ${isFadingOut ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="font-mono text-yellow-300 text-sm">
                                                    <span className="font-bold">New Pattern:</span> {discovery.match}
                                                </p>
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${getFrameworkChipColor(discovery.framework)}`}>
                                                    {discovery.framework}
                                                </span>
                                            </div>
                                            <p className="text-sat-white mb-3">
                                                <span className="text-yellow-300 font-semibold mr-2">🤖 AI Suggestion:</span>
                                                {discovery.solution}
                                            </p>
                                            <button 
                                                onClick={() => handleAddDiscovery(discovery)}
                                                disabled={isAdded || isFadingOut}
                                                className="px-4 py-1 text-sm bg-sat-accent/20 text-sat-accent font-semibold rounded-md hover:bg-sat-accent/40 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isAdded ? '✔ Added' : 'Add to Knowledge Base'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!error && analysisResult?.length === 0 && newDiscoveries.length === 0 && (
                        <div className="text-center p-4 bg-green-900/50 text-green-300 rounded-lg">
                            <p className="font-semibold">✅ No known errors found in the log. System appears healthy!</p>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
};