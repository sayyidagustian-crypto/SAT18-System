import React, { useState, useEffect } from 'react';
import type { KnowledgeBaseEntry } from '../types';

interface KnowledgeBaseProps {
    staticData: KnowledgeBaseEntry[];
    learnedData: KnowledgeBaseEntry[];
    highlightedItem: string | null;
}

const AccordionSection: React.FC<{ title: string; data: KnowledgeBaseEntry[]; startAccordionsOpen?: boolean; initialOpen?: boolean; highlightedItem: string | null; }> = ({ title, data, startAccordionsOpen = false, initialOpen = false, highlightedItem }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    useEffect(() => {
        // Automatically open the section if a search yields results within it
        if (startAccordionsOpen && data.length > 0) {
            setIsOpen(true);
        }
    }, [startAccordionsOpen, data.length]);


    if (data.length === 0 && !startAccordionsOpen) { // Don't render if empty, unless we are searching
        return null;
    }
     if (startAccordionsOpen && data.length === 0) { // Don't render if search yields no results in this section
        return null;
    }


    return (
        <>
            <h3 
                className="text-2xl font-bold text-center text-sat-accent mb-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <span className={`inline-block ml-2 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
            </h3>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="space-y-3">
                    {data.map((entry, index) => (
                       <FrameworkAccordion key={`${entry.framework}-${index}`} entry={entry} startOpen={startAccordionsOpen} highlightedItem={highlightedItem} />
                    ))}
                </div>
            </div>
        </>
    );
};

const FrameworkAccordion: React.FC<{ entry: KnowledgeBaseEntry; startOpen?: boolean; highlightedItem: string | null; }> = ({ entry, startOpen = false, highlightedItem }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    
    useEffect(() => {
        // This effect ensures that when a search starts, the accordion opens.
        // It also opens the accordion if a new item is added to it.
        if (startOpen || entry.errors.some(e => e.error === highlightedItem)) {
            setIsOpen(true);
        }
    }, [startOpen, highlightedItem, entry.errors]);
    
    return (
        <div className="bg-sat-blue rounded-lg border border-sat-gray/50 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left text-lg font-semibold text-sat-white transition-colors hover:bg-sat-gray/20"
                aria-expanded={isOpen}
            >
                <span className="flex items-center">
                    {entry.icon && <entry.icon className="h-6 w-6 mr-3 text-sat-accent" />}
                    {entry.framework}
                </span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    ▼
                </span>
            </button>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="p-4 border-t border-sat-gray/50">
                    <ul className="space-y-3 text-sat-lightgray">
                        {entry.errors.map((item, errIndex) => (
                            <li key={errIndex} className={`p-2 rounded-md ${item.error === highlightedItem ? 'highlight-new' : ''}`}>
                                <p className="font-mono text-sm text-red-400">
                                    {item.error}
                                </p>
                                <p className="text-sm">
                                    <span className="text-sat-accent font-medium">↳ Solution: </span>{item.solution}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}


export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ staticData, learnedData, highlightedItem }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filterData = (data: KnowledgeBaseEntry[]): KnowledgeBaseEntry[] => {
        if (!searchTerm.trim()) {
            return data;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return data.filter(entry => {
            const frameworkMatch = entry.framework.toLowerCase().includes(lowercasedFilter);
            const errorMatch = entry.errors.some(err =>
                err.error.toLowerCase().includes(lowercasedFilter) ||
                err.solution.toLowerCase().includes(lowercasedFilter)
            );
            return frameworkMatch || errorMatch;
        });
    };

    const filteredStaticData = filterData(staticData);
    const filteredLearnedData = filterData(learnedData);
    const isSearching = searchTerm.trim().length > 0;

    return (
        <div className="bg-sat-lightblue p-6 sm:p-8 rounded-xl shadow-2xl border border-sat-gray w-full">
            <h2 className="text-3xl font-bold text-center text-sat-white mb-4">
                🧠 System Knowledge Base
            </h2>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search knowledge base (e.g., 'Hydration', 'Docker', 'npm')..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-sat-blue text-sat-lightgray p-3 pl-10 rounded-lg border-2 border-sat-gray focus:border-sat-accent focus:ring-2 focus:ring-sat-accent/50 transition-colors duration-200"
                    aria-label="Search Knowledge Base"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-sat-gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            
            <AccordionSection title="Core Knowledge" data={filteredStaticData} initialOpen={!isSearching} startAccordionsOpen={isSearching} highlightedItem={highlightedItem} />

            {learnedData.length > 0 && (
                <div className="mt-8 pt-6 border-t border-sat-gray">
                    <AccordionSection title="Learned From Your Logs" data={filteredLearnedData} initialOpen={true} startAccordionsOpen={isSearching} highlightedItem={highlightedItem} />
                </div>
            )}

            {isSearching && filteredStaticData.length === 0 && filteredLearnedData.length === 0 && (
                 <div className="text-center p-4 text-sat-lightgray rounded-lg bg-sat-blue mt-4">
                    <p>No results found for "{searchTerm}".</p>
                </div>
            )}
        </div>
    );
};