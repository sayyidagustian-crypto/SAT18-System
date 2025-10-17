import React, { useState, useEffect, useRef } from 'react';
import { analyzeLog } from '../services/analyzerService';
import { generateFixScriptWithGemini } from '../services/geminiService';
import type { AnalysisResult, KnowledgeBaseEntry, RepairHistoryEntry } from '../types';
import { isKnownError } from '../utils/knowledgeUtils';
import { isRiskyScript, getConfidenceDetails } from '../utils/scriptUtils';
import { fuzzyMatch } from '../utils/fuzzyMatch';
import { CodeBlock } from './CodeBlock';
import { RobotIcon, SearchIcon, UploadIcon } from './CustomIcons';


interface ErrorAnalyzerToolProps {
    knowledgeBase: KnowledgeBaseEntry[];
    repairHistory: RepairHistoryEntry[];
    onAddToKnowledgeBase: (result: AnalysisResult) => void;
    onAddScriptToHistory: (entry: Omit<RepairHistoryEntry, 'timestamp' | 'status'>) => void;
}

const ProvenFixIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


export const ErrorAnalyzerTool: React.FC<ErrorAnalyzerToolProps> = ({ knowledgeBase, repairHistory, onAddToKnowledgeBase, onAddScriptToHistory }) => {
    const [logContent, setLogContent] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult[] | null>(null);
    const [newDiscoveries, setNewDiscoveries] = useState<AnalysisResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
    const [fadingOutItems, setFadingOutItems] = useState<Set<string>>(new Set());
    const [fixScripts, setFixScripts] = useState<Record<string, string>>({});
    const [generatingScriptFor, setGeneratingScriptFor] = useState<Set<string>>(new Set());
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const updatedDiscoveries = newDiscoveries.filter(d => !isKnownError(d, knowledgeBase));
        if (updatedDiscoveries.length !== newDiscoveries.length) {
             setNewDiscoveries(updatedDiscoveries);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [knowledgeBase]);


    const performAnalysis = async (logToAnalyze: string) => {
        if (!logToAnalyze) return;

        setIsLoading(true);
        setAnalyzed(true);
        setError(null);
        setAnalysisResult(null);
        setNewDiscoveries([]);
        setAddedItems(new Set());
        setFadingOutItems(new Set());
        setFixScripts({});
        setGeneratingScriptFor(new Set());

        try {
            const results = await analyzeLog(logToAnalyze);

            const knownResults = results.filter(r => isKnownError(r, knowledgeBase));
            const unknownResults = results.filter(r => !isKnownError(r, knowledgeBase));
            
            setAnalysisResult(knownResults);
            setNewDiscoveries(unknownResults);

        } catch (e) {
            console.error(e);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileRead = (file: File) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("File is too large. Please select a file smaller than 5MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (text) {
                setLogContent(text);
                performAnalysis(text);
            }
        };
        reader.onerror = () => setError("Failed to read the file.");
        reader.readAsText(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileRead(e.target.files[0]);
        }
        e.target.value = ''; // Reset to allow re-uploading the same file
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileRead(e.dataTransfer.files[0]);
        }
    };

    const handleAddDiscovery = (discovery: AnalysisResult) => {
        setAddedItems(prev => new Set(prev).add(discovery.match));
        setFadingOutItems(prev => new Set(prev).add(discovery.match));
        
        setTimeout(() => {
            onAddToKnowledgeBase(discovery);
        }, 500); 
    };

     const handleGenerateFixScript = async (result: AnalysisResult) => {
        setGeneratingScriptFor(prev => new Set(prev).add(result.match));
        try {
            const script = await generateFixScriptWithGemini(result.match, result.solution);
            setFixScripts(prev => ({...prev, [result.match]: script}));
            if (!script.trim().startsWith('#')) {
                onAddScriptToHistory({ match: result.match, script });
            }
        } catch (e) {
            console.error("Failed to generate script:", e);
            setFixScripts(prev => ({...prev, [result.match]: "# Failed to generate script."}));
        } finally {
            setGeneratingScriptFor(prev => {
                const newSet = new Set(prev);
                newSet.delete(result.match);
                return newSet;
            });
        }
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

    const renderFixSuggestion = (result: AnalysisResult) => {
        // 1. Check for an exact proven fix
        const exactProvenFix = repairHistory.find(h => h.match === result.match && h.status === 'success');
        if (exactProvenFix) {
            const confidenceDetails = getConfidenceDetails(result.match, repairHistory);
            return (
                <div className="mt-3">
                    <p className="text-sm font-semibold text-green-400 flex items-center gap-2 mb-1">
                        <ProvenFixIcon className="h-5 w-5" />
                        Proven Fix from Your History
                    </p>
                    <CodeBlock 
                        script={exactProvenFix.script} 
                        isRisky={isRiskyScript(exactProvenFix.script)}
                        confidenceDetails={confidenceDetails}
                    />
                </div>
            );
        }

        // 2. If no exact fix, try a fuzzy search
        const FUZZY_MATCH_THRESHOLD = 0.6;
        const potentialFuzzyMatches = repairHistory
            .map(h => ({ ...h, similarity: fuzzyMatch(result.match, h.match) }))
            .filter(h => h.similarity >= FUZZY_MATCH_THRESHOLD && h.match !== result.match)
            .sort((a, b) => b.similarity - a.similarity);

        let bestFuzzyFix = null;
        for (const potentialFix of potentialFuzzyMatches) {
            const confidence = getConfidenceDetails(potentialFix.match, repairHistory);
            if (confidence.level === 'high' || confidence.level === 'medium') {
                bestFuzzyFix = potentialFix;
                break;
            }
        }

        if (bestFuzzyFix) {
            const confidenceDetails = getConfidenceDetails(bestFuzzyFix.match, repairHistory);
            return (
                 <div className="mt-3 p-3 bg-sky-900/30 rounded-lg border border-sky-500/40 animate-fade-in" title={`Original error: "${bestFuzzyFix.match}" (Similarity: ${Math.round(bestFuzzyFix.similarity * 100)}%)`}>
                    <p className="text-sm font-semibold text-sky-300 flex items-center gap-2 mb-1">
                        <SearchIcon className="h-5 w-5" />
                        Similar Fix from Your History
                    </p>
                    <CodeBlock 
                        script={bestFuzzyFix.script} 
                        isRisky={isRiskyScript(bestFuzzyFix.script)}
                        confidenceDetails={confidenceDetails}
                    />
                </div>
            )
        }

        // 3. If no exact or fuzzy fix, check for a newly generated script
        if (fixScripts[result.match]) {
            const script = fixScripts[result.match];
            return <CodeBlock script={script} isRisky={isRiskyScript(script)} />;
        }

        // 4. Fallback to the generate button
        return (
            <button 
                onClick={() => handleGenerateFixScript(result)}
                disabled={generatingScriptFor.has(result.match)}
                className="mt-3 px-4 py-1 text-sm bg-sat-accent/20 text-sat-accent font-semibold rounded-md hover:bg-sat-accent/40 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
                {generatingScriptFor.has(result.match) ? 'Generating...' : 'Generate Fix Script'}
            </button>
        );
    };

    return (
        <div>
            <label htmlFor="log-input" className="block text-lg font-semibold text-sat-white mb-2">
                Paste your build log or drop a file:
            </label>
            <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative rounded-lg border-2 transition-colors duration-200 ${isDraggingOver ? 'border-sat-accent' : 'border-sat-gray'}`}
            >
                <textarea
                    id="log-input"
                    className="w-full h-64 bg-sat-blue text-sat-lightgray p-4 rounded-lg border-none focus:ring-0 font-mono text-sm"
                    placeholder="e.g., Error: Cannot find module 'express'..."
                    value={logContent}
                    onChange={(e) => setLogContent(e.target.value)}
                    aria-label="Build log input"
                ></textarea>
                {isDraggingOver && (
                    <div className="absolute inset-0 bg-sat-accent/20 flex items-center justify-center pointer-events-none rounded-lg">
                        <p className="text-xl font-bold text-sat-accent">Drop file to analyze</p>
                    </div>
                )}
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".log,.txt,text/plain"
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-sat-gray text-sat-white font-bold rounded-lg hover:bg-sat-lightgray hover:text-sat-blue transition-colors"
                    aria-label="Upload a log file"
                >
                    <UploadIcon className="h-5 w-5" />
                    Upload Log File
                </button>
                <button
                    onClick={() => performAnalysis(logContent)}
                    disabled={!logContent || isLoading}
                    className="w-full sm:w-auto px-8 py-3 bg-sat-accent text-sat-blue font-bold rounded-lg shadow-lg hover:bg-sky-400 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                    <h3 className="text-xl font-bold text-sat-white mb-4 text-center">Analysis Results</h3>
                    {error && (
                        <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">
                            <p className="font-semibold">{error}</p>
                        </div>
                    )}
                    
                    {analysisResult && analysisResult.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-sat-white mb-3">Known Errors (Offline Analysis)</h4>
                            {analysisResult.map((result, index) => (
                                <div key={index} className="bg-sat-blue p-4 rounded-lg border border-sat-gray/50 animate-fade-in">
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
                                    {renderFixSuggestion(result)}
                                </div>
                            ))}
                        </div>
                    )}

                    {newDiscoveries.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-dashed border-sat-accent/30">
                             <div className="text-lg font-bold text-sat-accent mb-3 flex items-center gap-2">
                                 <RobotIcon className="h-5 w-5" />
                                 <h4>New Discoveries (Requires AI Analysis)</h4>
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
                                            
                                            {renderFixSuggestion(discovery)}
                                            
                                            <button 
                                                onClick={() => handleAddDiscovery(discovery)}
                                                disabled={isAdded || isFadingOut}
                                                className="mt-3 ml-2 px-4 py-1 text-sm bg-sat-accent/20 text-sat-accent font-semibold rounded-md hover:bg-sat-accent/40 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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