import React, { useRef, useState } from 'react';
import { exportMemory, importMemory } from '../services/localMemoryService';
import { UploadIcon, DownloadIcon } from './CustomIcons';

interface CollaborativeSharingProps {
    onImportSuccess: () => void;
}

export const CollaborativeSharing: React.FC<CollaborativeSharingProps> = ({ onImportSuccess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleExport = () => {
        try {
            const dataStr = exportMemory();
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sat18-memory.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setMessage({ type: 'success', text: 'Memory exported successfully!' });
        } catch (e) {
            console.error("Export failed", e);
            setMessage({ type: 'error', text: 'Failed to export memory.' });
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (window.confirm("Are you sure? This will overwrite your current learned knowledge and repair history.")) {
                const result = importMemory(content);
                if (result.success) {
                    setMessage({ type: 'success', text: 'Memory imported successfully! The page will now refresh.' });
                    setTimeout(() => {
                        onImportSuccess(); // This will trigger re-renders in App.tsx
                        setMessage(null);
                    }, 1500);
                } else {
                    setMessage({ type: 'error', text: result.error || 'An unknown error occurred during import.' });
                }
            }
        };
        reader.onerror = () => {
             setMessage({ type: 'error', text: 'Failed to read the file.' });
        };
        reader.readAsText(file);
        
        // Reset the file input value to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    return (
        <div className="p-4">
            <p className="text-center text-sat-lightgray mb-6">
                Share your system's learned knowledge with your team, or import a memory file from a trusted peer to bootstrap your system's intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-sat-accent/20 text-sat-accent font-bold rounded-lg shadow-md hover:bg-sat-accent/40 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    <DownloadIcon className="h-5 w-5" />
                    Export Memory
                </button>
                <button
                    onClick={handleImportClick}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-sat-gray text-sat-white font-bold rounded-lg shadow-md hover:bg-sat-lightgray hover:text-sat-blue transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    <UploadIcon className="h-5 w-5" />
                    Import Memory
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                    aria-hidden="true"
                />
            </div>
            {message && (
                <div className={`mt-6 p-3 text-center rounded-md text-sm font-semibold animate-fade-in ${message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};
