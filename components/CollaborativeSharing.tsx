import React, { useState, useCallback, useRef } from 'react';
import * as localMemory from '../services/localMemoryService';
import type { MemoryPackage } from '../types';
import { isRiskyScript } from '../utils/scriptUtils';

interface CollaborativeSharingProps {
    onPackageImport: (pkg: MemoryPackage) => void;
}

const ExportIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
);
const ImportIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}><path d="M10.75 17.25a.75.75 0 001.5 0V8.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03l2.955-3.129v8.614z" /><path d="M3.5 4.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 10h10.5A2.75 2.75 0 0018 7.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
);
const ShieldExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}><path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.25a.75.75 0 01-1.5 0V1.75A.75.75 0 0110 1zM8.857 3.643a.75.75 0 01.092 1.058l-1.02 1.482a.75.75 0 01-1.15-.796l1.02-1.482a.75.75 0 011.058-.262zM12.102 4.7a.75.75 0 011.15.796l-1.02 1.482a.75.75 0 01-1.15-.796l1.02-1.482zM4.7 12.102a.75.75 0 01.796-1.15l1.482 1.02a.75.75 0 01-.796 1.15l-1.482-1.02zM15.299 11.043a.75.75 0 01.262 1.058l-1.482 1.02a.75.75 0 01-1.058-.262l1.482-1.02a.75.75 0 01.796-.796zM10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 10-2 0v.25a1 1 0 102 0V10zm2-1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
);


export const CollaborativeSharing: React.FC<CollaborativeSharingProps> = ({ onPackageImport }) => {
    const [importError, setImportError] = useState<string | null>(null);
    const [importedPackage, setImportedPackage] = useState<MemoryPackage | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = useCallback(() => {
        try {
            const memoryJson = localMemory.exportMemory();
            const blob = new Blob([memoryJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sat18-memory-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export memory:", error);
        }
    }, []);
    
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setImportError(null);
        setImportedPackage(null);
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const pkg = localMemory.validateAndParseMemoryPackage(content);
                setImportedPackage(pkg);
            } catch (err: any) {
                setImportError(`Failed to parse file: ${err.message}`);
            }
        };
        reader.onerror = () => {
            setImportError('Failed to read the file.');
        };
        reader.readAsText(file);
    }, []);

    const handleConfirmImport = useCallback(() => {
        if (importedPackage) {
            onPackageImport(importedPackage);
            setImportedPackage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [importedPackage, onPackageImport]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-sat-white mb-2">Export Your Knowledge</h3>
                <p className="text-sm text-sat-lightgray mb-3">
                    Export your learned knowledge and repair history into a single `.json` file to share with your team.
                </p>
                <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sat-gray text-sat-white font-bold rounded-lg hover:bg-sat-lightgray hover:text-sat-blue transition-colors"
                >
                    <ExportIcon className="h-5 w-5"/>
                    Export Memory
                </button>
            </div>
            
            <div className="pt-6 border-t border-sat-gray">
                <h3 className="text-lg font-semibold text-sat-white mb-2">Import Knowledge Package</h3>
                <p className="text-sm text-sat-lightgray mb-3">
                    Import a `.json` memory file from a teammate. All imported packages will be sent to the Quarantine Queue for review.
                </p>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="block w-full text-sm text-sat-lightgray file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sat-accent file:text-sat-blue hover:file:bg-sky-400"
                />
            </div>

            {importError && (
                <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm font-semibold animate-fade-in">
                    {importError}
                </div>
            )}

            {importedPackage && (
                <div className="mt-4 p-4 bg-sat-blue rounded-lg border border-sat-accent/50 animate-fade-in space-y-4">
                    <h4 className="text-md font-bold text-sat-white">Import Preview</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="bg-sat-lightblue p-2 rounded-md"><span className="font-bold block text-lg text-sat-accent">{importedPackage.stats.knowledgeEntries}</span><span className="text-xs">Knowledge Entries</span></div>
                        <div className="bg-sat-lightblue p-2 rounded-md"><span className="font-bold block text-lg text-sat-accent">{importedPackage.stats.historyEntries}</span><span className="text-xs">History Entries</span></div>
                        <div className="bg-sat-lightblue p-2 rounded-md"><span className="font-bold block text-lg text-sat-accent">{new Date(importedPackage.metadata.exportedAt).toLocaleDateString()}</span><span className="text-xs">Exported On</span></div>
                        <div className={`bg-sat-lightblue p-2 rounded-md ${importedPackage.stats.riskyScripts > 0 ? 'text-yellow-300' : ''}`}>
                            <span className="font-bold block text-lg">{importedPackage.stats.riskyScripts}</span>
                            <span className="text-xs">Risky Scripts</span>
                        </div>
                    </div>
                    {importedPackage.stats.riskyScripts > 0 && (
                        <div className="flex items-center gap-2 p-2 text-xs text-yellow-300 bg-yellow-900/40 rounded-md">
                            <ShieldExclamationIcon className="h-5 w-5 shrink-0" />
                            <span>This package contains potentially risky scripts and requires mandatory review in the Quarantine Queue.</span>
                        </div>
                    )}
                    <div className="text-right">
                         <button
                            onClick={handleConfirmImport}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-sat-accent text-sat-blue font-bold rounded-lg hover:bg-sky-400 transition-colors"
                        >
                            <ImportIcon className="h-5 w-5"/>
                            Send to Quarantine Queue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
