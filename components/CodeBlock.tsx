import React, { useState, useEffect } from 'react';
import type { ConfidenceDetails } from '../types';

interface CodeBlockProps {
    script: string;
    isRisky?: boolean;
    confidenceDetails?: ConfidenceDetails;
}

const ShieldCheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9a.5.5 0 0 1-1 0V5.5A5.5 5.5 0 0 1 10 0a5.5 5.5 0 0 1 5.5 5.5V9a.5.5 0 0 1-1 0V5.5A4.5 4.5 0 0 0 10 1Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M5.5 10a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3 10a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 3 10Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.707-10.707a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
    </svg>
);


const WarningIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M8.257 3.099c.636-1.1 2.296-1.1 2.932 0l7.106 12.25c.636 1.1-.194 2.501-1.466 2.501H2.617c-1.272 0-2.102-1.401-1.466-2.501l7.106-12.25zM10 14a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);


const Badge: React.FC<{
    icon: React.ComponentType<{className?: string}>;
    text: string;
    bgColor: string;
    textColor: string;
    position: 'left' | 'right';
}> = ({ icon: Icon, text, bgColor, textColor, position }) => (
    <div className={`absolute -top-3 ${position === 'left' ? 'left-4' : 'right-4'} flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full ${bgColor} ${textColor} shadow-lg z-10`}>
        <Icon className="h-3.5 w-3.5" />
        <span>{text}</span>
    </div>
);


export const CodeBlock: React.FC<CodeBlockProps> = ({ script, isRisky = false, confidenceDetails }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [riskAcknowledged, setRiskAcknowledged] = useState(false);

    useEffect(() => {
        setRiskAcknowledged(false);
    }, [script]);

    const handleCopy = () => {
        navigator.clipboard.writeText(script);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const { level, successCount, total } = confidenceDetails || {};
    const showConfidenceBadge = confidenceDetails && total !== undefined && total > 0;

    const confidenceConfigs = {
        high: {
            Icon: ShieldCheckIcon,
            text: 'High Confidence',
            bgColor: 'bg-green-400',
            textColor: 'text-green-900',
        },
        medium: {
            Icon: WarningIcon,
            text: 'Medium Confidence',
            bgColor: 'bg-yellow-400',
            textColor: 'text-yellow-900',
        },
        low: {
            Icon: XCircleIcon,
            text: 'Low Confidence',
            bgColor: 'bg-orange-400',
            textColor: 'text-orange-900',
        }
    };
    
    const confidenceConfig = level ? confidenceConfigs[level] : null;

    return (
        <div className={`mt-4 bg-sat-blue rounded-lg border relative group animate-fade-in ${isRisky ? 'border-yellow-500/60' : 'border-sat-gray/50'}`}>
            {showConfidenceBadge && confidenceConfig && (
                 <Badge 
                    icon={confidenceConfig.Icon}
                    text={`${confidenceConfig.text} (${successCount}/${total} successful)`}
                    bgColor={confidenceConfig.bgColor}
                    textColor={confidenceConfig.textColor}
                    position="left"
                />
            )}
             {isRisky && (
                <Badge 
                    icon={WarningIcon}
                    text="Risky Command"
                    bgColor="bg-red-500"
                    textColor="text-red-100"
                    position={showConfidenceBadge ? 'right' : 'left'}
                />
            )}
            
            <div className="p-3 pt-5">
                <pre className="text-sm text-sat-white overflow-x-auto pr-16 py-1">
                    <code>{script}</code>
                </pre>
                {isRisky && (
                     <div className="mt-3 p-2 bg-yellow-900/40 rounded-md border border-yellow-500/50 animate-fade-in">
                        <label className="flex items-center text-xs text-yellow-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={riskAcknowledged}
                                onChange={(e) => setRiskAcknowledged(e.target.checked)}
                                className="h-4 w-4 bg-sat-blue border-yellow-400 text-yellow-500 focus:ring-yellow-500/50 rounded mr-2 shrink-0 cursor-pointer"
                                aria-labelledby="risk-acknowledgement-label"
                            />
                            <span id="risk-acknowledgement-label">I understand this command is potentially risky and will review it before execution.</span>
                        </label>
                    </div>
                )}
            </div>
            
            <button
                onClick={handleCopy}
                disabled={(isRisky && !riskAcknowledged) || isCopied}
                className="absolute top-1/2 -translate-y-1/2 right-2 px-3 py-1 text-xs bg-sat-gray text-sat-white font-semibold rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-sat-gray"
                aria-label="Copy code to clipboard"
            >
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};
