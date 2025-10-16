import React, { useState } from 'react';
import type { QuarantinedMemoryPackage, MergeStrategy } from '../types';
import { ArrowPathIcon, ShieldCheckIcon } from './CustomIcons';

interface QuarantineQueueProps {
    packages: QuarantinedMemoryPackage[];
    onApprove: (packageId: string, strategy: MergeStrategy) => void;
    onReject: (packageId: string) => void;
}

const StrategyButton: React.FC<{
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isSelected: boolean;
    onClick: () => void;
}> = ({ label, description, icon: Icon, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${isSelected ? 'bg-sat-accent/20 border-sat-accent' : 'bg-sat-blue border-sat-gray hover:border-sat-lightgray'}`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 shrink-0 ${isSelected ? 'text-sat-accent' : 'text-sat-lightgray'}`} />
            <div>
                <p className={`font-bold ${isSelected ? 'text-sat-white' : 'text-sat-lightgray'}`}>{label}</p>
                <p className="text-xs text-sat-lightgray">{description}</p>
            </div>
        </div>
    </button>
);


const QuarantineItem: React.FC<{
    pkg: QuarantinedMemoryPackage;
    onApprove: (packageId: string, strategy: MergeStrategy) => void;
    onReject: (packageId: string) => void;
}> = ({ pkg, onApprove, onReject }) => {
    const [isApproving, setIsApproving] = useState(false);
    const [strategy, setStrategy] = useState<MergeStrategy>('prefer-local');

    const handleConfirmApproval = () => {
        onApprove(pkg.id, strategy);
    };

    if (pkg.status !== 'pending') return null;

    return (
        <div className="bg-sat-blue p-4 rounded-lg border border-sat-gray/50 animate-fade-in space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-mono text-sm text-sat-white">Package ID: {pkg.id}</p>
                    <p className="text-xs text-sat-gray">Imported: {new Date(pkg.importDate).toLocaleString()}</p>
                </div>
                 <div className={`text-xs font-bold px-2 py-1 rounded-full ${pkg.status === 'pending' ? 'bg-yellow-800 text-yellow-200' : 'bg-sat-gray text-sat-white'}`}>
                    {pkg.status}
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
                <div className="bg-sat-lightblue p-2 rounded-md"><span className="font-bold block text-lg text-sat-accent">{pkg.stats.knowledgeEntries}</span><span className="text-xs">Knowledge</span></div>
                <div className="bg-sat-lightblue p-2 rounded-md"><span className="font-bold block text-lg text-sat-accent">{pkg.stats.historyEntries}</span><span className="text-xs">History</span></div>
                <div className={`bg-sat-lightblue p-2 rounded-md ${pkg.stats.riskyScripts > 0 ? 'text-yellow-300' : ''}`}>
                    <span className="font-bold block text-lg">{pkg.stats.riskyScripts}</span>
                    <span className="text-xs">Risky Scripts</span>
                </div>
            </div>

            {isApproving && (
                <div className="pt-3 mt-3 border-t border-sat-gray animate-fade-in space-y-3">
                    <h5 className="font-bold text-sat-white">Select Merge Strategy</h5>
                    <div className="space-y-2">
                       <StrategyButton
                            label="Prefer Local"
                            description="Keeps your existing data if conflicts are found. New data is added."
                            icon={ShieldCheckIcon}
                            isSelected={strategy === 'prefer-local'}
                            onClick={() => setStrategy('prefer-local')}
                        />
                        <StrategyButton
                            label="Overwrite"
                            description="Overwrites your local data with incoming data if conflicts are found."
                            icon={ArrowPathIcon}
                            isSelected={strategy === 'overwrite'}
                            onClick={() => setStrategy('overwrite')}
                        />
                    </div>
                </div>
            )}
            
            <div className="flex items-center justify-end gap-2 pt-2">
                {isApproving ? (
                    <>
                        <button onClick={() => setIsApproving(false)} className="px-3 py-1 text-xs bg-sat-gray text-sat-white font-semibold rounded-md hover:bg-sat-lightgray hover:text-sat-blue transition-colors">Cancel</button>
                        <button onClick={handleConfirmApproval} className="px-4 py-1.5 text-sm bg-green-600 text-white font-bold rounded-md hover:bg-green-500 transition-colors">Confirm Approval</button>
                    </>
                ) : (
                     <>
                        <button onClick={() => onReject(pkg.id)} className="px-3 py-1 text-xs bg-red-800/70 text-red-200 font-semibold rounded-md hover:bg-red-700 transition-colors">Reject</button>
                        <button onClick={() => setIsApproving(true)} className="px-4 py-1.5 text-sm bg-sat-accent text-sat-blue font-bold rounded-md hover:bg-sky-400 transition-colors">Approve...</button>
                    </>
                )}
            </div>
        </div>
    );
};


export const QuarantineQueue: React.FC<QuarantineQueueProps> = ({ packages, onApprove, onReject }) => {
    const pendingPackages = packages.filter(p => p.status === 'pending');

    if (packages.length === 0) {
        return <p className="text-center text-sat-lightgray">The quarantine queue is empty.</p>;
    }

    if (pendingPackages.length === 0) {
        return <p className="text-center text-sat-lightgray">No packages are currently awaiting review.</p>;
    }

    return (
        <div className="space-y-4">
            {pendingPackages.map(pkg => (
                <QuarantineItem key={pkg.id} pkg={pkg} onApprove={onApprove} onReject={onReject} />
            ))}
        </div>
    );
};
