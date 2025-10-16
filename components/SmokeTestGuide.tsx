import React, { useState, useMemo } from 'react';

const testPhases = [
    {
        phase: "Fase 1: Pintu Depan — Error Baru",
        tests: [
            { id: '1.1', action: 'In "Log Analyzer", paste the log: `error TS2307: Cannot find module \'./App\' or its corresponding type declarations.`', expected: 'The "New Discoveries" section appears with an AI suggestion. "Known Errors" is empty.' },
            { id: '1.2', action: 'Click "Generate Fix Script" for the new discovery.', expected: 'A command appears in a CodeBlock and is added to "Repair Script History" as pending.' },
            { id: '1.3', action: 'Click "Add to Knowledge Base".', expected: 'The discovery fades out and appears in the "Knowledge Base" section below.' },
            { id: '1.4', action: 'In "Repair Script History", mark the new script as "success".', expected: 'The success (thumbs-up) icon highlights, increasing the confidence score for this fix.' }
        ]
    },
    {
        phase: "Fase 2: Ruang Tamu — Repair History",
        tests: [
            { id: '2.1', action: 'Open the "Repair Script History" section.', expected: 'The script from Phase 1 is visible at the top, marked as successful.' },
        ]
    },
    {
        phase: "Fase 3: Dapur — Collaborative Sharing",
        tests: [
            { id: '3.1', action: 'Go to "Collaborative Sharing" and click "Export Memory".', expected: 'A `.json` file downloads, containing the knowledge added in Phase 1.' },
            { id: '3.2', action: 'Import the same file. In the preview, click "Send to Quarantine Queue".', expected: 'The preview disappears and a new package appears in the "Quarantine Queue" section.' },
        ]
    },
    {
        phase: "Fase 4: Ruang Kerja — Governance",
        tests: [
            { id: '4.1', action: 'In "Quarantine Queue", click "Approve..." on the new package.', expected: 'Merge strategy options appear below the package details.' },
            { id: '4.2', action: 'Select the "Overwrite" strategy and click "Confirm Approval".', expected: 'The package disappears from the pending queue and an "approve" entry is added to the "Audit Trail".' },
        ]
    },
    {
        phase: "Fase 5: Taman Belakang — Audit & Rollback",
        tests: [
            { id: '5.1', action: 'Open "Audit Trail" and find the "approve" entry from Phase 4.', expected: 'The entry is visible at the top and has an active "Rollback" button.' },
            { id: '5.2', action: 'Click "Rollback" and confirm the action.', expected: 'The entry is marked "(Rolled Back)", and a new "rollback" action is logged at the top.' },
            { id: '5.3', action: 'Check the "Knowledge Base" again.', expected: 'The knowledge from the imported package should now be gone, confirming the state was restored.' }
        ]
    }
];

const allTestIds = testPhases.flatMap(phase => phase.tests.map(test => test.id));

interface SmokeTestGuideProps {
    onResetState: () => void;
}

export const SmokeTestGuide: React.FC<SmokeTestGuideProps> = ({ onResetState }) => {
    const [completedTests, setCompletedTests] = useState<Record<string, boolean>>(() => {
        const saved = sessionStorage.getItem('smokeTestProgress');
        return saved ? JSON.parse(saved) : {};
    });

    const toggleTest = (id: string) => {
        setCompletedTests(prev => {
            const newState = { ...prev, [id]: !prev[id] };
            sessionStorage.setItem('smokeTestProgress', JSON.stringify(newState));
            return newState;
        });
    };
    
    const resetProgress = () => {
        sessionStorage.removeItem('smokeTestProgress');
        setCompletedTests({});
    };

    const completedCount = useMemo(() => Object.values(completedTests).filter(Boolean).length, [completedTests]);
    const totalCount = allTestIds.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-sat-white">Overall Progress</span>
                    <span className="text-sat-accent">{completedCount} / {totalCount} Completed</span>
                </div>
                <div className="w-full bg-sat-blue rounded-full h-2.5 border border-sat-gray">
                    <div className="bg-sat-accent h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
            <div className="text-center">
                <button
                    onClick={onResetState}
                    className="px-4 py-2 text-sm bg-red-800/70 text-red-200 font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                    Reset All App Data (For Clean Test Run)
                </button>
                 <button
                    onClick={resetProgress}
                    className="ml-4 px-4 py-2 text-sm bg-sat-gray text-sat-white font-bold rounded-lg hover:bg-sat-lightgray hover:text-sat-blue transition-colors"
                >
                    Reset Checklist Progress
                </button>
            </div>
            
            {testPhases.map((phase, phaseIndex) => (
                <div key={phaseIndex} className="bg-sat-blue rounded-lg border border-sat-gray/50 p-4 animate-fade-in">
                    <h3 className="text-lg font-bold text-sat-accent mb-3">{phase.phase}</h3>
                    <div className="divide-y divide-sat-gray/50">
                        {phase.tests.map(test => (
                            <div key={test.id} className="py-3 flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    id={`test-${test.id}`}
                                    checked={!!completedTests[test.id]}
                                    onChange={() => toggleTest(test.id)}
                                    className="mt-1 h-5 w-5 bg-sat-blue border-sat-gray text-sat-accent focus:ring-sat-accent/50 rounded cursor-pointer shrink-0"
                                />
                                <label htmlFor={`test-${test.id}`} className={`flex-1 cursor-pointer transition-opacity ${completedTests[test.id] ? 'opacity-50 line-through' : 'opacity-100'}`}>
                                    <p className="font-semibold text-sat-white">Action: <span className="font-normal">{test.action}</span></p>
                                    <p className="text-sm text-sat-lightgray mt-1">🎯 Expected Result: <span className="font-normal">{test.expected}</span></p>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
