import React, { useState, useMemo, useCallback, useEffect } from 'react';

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
    onProgressUpdate: (completed: number, total: number) => void;
}

export const SmokeTestGuide: React.FC<SmokeTestGuideProps> = ({ onResetState, onProgressUpdate }) => {
    const [completedTests, setCompletedTests] = useState<Record<string, boolean>>(() => {
        const saved = sessionStorage.getItem('smokeTestProgress');
        return saved ? JSON.parse(saved) : {};
    });

    const [testResults, setTestResults] = useState<Record<string, { actual: string; notes: string }>>(() => {
        const saved = sessionStorage.getItem('smokeTestResults');
        return saved ? JSON.parse(saved) : {};
    });

    const toggleTest = (id: string) => {
        setCompletedTests(prev => {
            const newState = { ...prev, [id]: !prev[id] };
            sessionStorage.setItem('smokeTestProgress', JSON.stringify(newState));
            return newState;
        });
    };
    
    const handleResultChange = (id: string, field: 'actual' | 'notes', value: string) => {
        setTestResults(prev => {
            const newResult = { ...(prev[id] || { actual: '', notes: '' }), [field]: value };
            const newState = { ...prev, [id]: newResult };
            sessionStorage.setItem('smokeTestResults', JSON.stringify(newState));
            return newState;
        });
    };

    const resetProgress = () => {
        sessionStorage.removeItem('smokeTestProgress');
        setCompletedTests({});
        sessionStorage.removeItem('smokeTestResults');
        setTestResults({});
    };

    const completedCount = useMemo(() => Object.values(completedTests).filter(Boolean).length, [completedTests]);
    const totalCount = allTestIds.length;

    useEffect(() => {
        onProgressUpdate(completedCount, totalCount);
    }, [completedCount, totalCount, onProgressUpdate]);
    
    const handleExportReport = useCallback(() => {
        let report = `# SAT18 Smoke Test Report\n\n`;
        report += `**Date:** ${new Date().toLocaleString()}\n`;
        report += `**Overall Progress:** ${completedCount} / ${totalCount} Completed (${(totalCount > 0 ? (completedCount / totalCount) * 100 : 0).toFixed(1)}%)\n\n`;
        
        testPhases.forEach(phase => {
            report += `## ${phase.phase}\n\n`;
            phase.tests.forEach(test => {
                const result = testResults[test.id] || { actual: '', notes: '' };
                const status = completedTests[test.id] ? '✅ Completed' : '⬜️ Incomplete';

                report += `### ${test.id} ${status}\n\n`;
                report += `**Action:**\n> ${test.action}\n\n`;
                report += `**Expected Result:**\n> ${test.expected}\n\n`;
                report += `**Actual Result:**\n\`\`\`text\n${result.actual || 'Not documented.'}\n\`\`\`\n\n`;
                report += `**Notes:**\n\`\`\`text\n${result.notes || 'No notes.'}\n\`\`\`\n\n`;
                report += '---\n\n';
            });
        });

        const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SAT18-SmokeTest-Report-${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [completedTests, testResults, completedCount, totalCount]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={handleExportReport}
                    className="px-4 py-2 text-sm bg-green-700 text-green-100 font-bold rounded-lg hover:bg-green-600 transition-colors"
                >
                    Export Test Report
                </button>
                <button
                    onClick={onResetState}
                    className="px-4 py-2 text-sm bg-red-800/70 text-red-200 font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                    Reset All App Data
                </button>
                 <button
                    onClick={resetProgress}
                    className="px-4 py-2 text-sm bg-sat-gray text-sat-white font-bold rounded-lg hover:bg-sat-lightgray hover:text-sat-blue transition-colors"
                >
                    Reset Checklist Progress
                </button>
            </div>
            
            {testPhases.map((phase, phaseIndex) => (
                <div key={phaseIndex} className="bg-sat-blue rounded-lg border border-sat-gray/50 p-4 animate-fade-in">
                    <h3 className="text-lg font-bold text-sat-accent mb-3">{phase.phase}</h3>
                    <div className="divide-y divide-sat-gray/50">
                        {phase.tests.map(test => (
                            <div key={test.id} className="py-4">
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        id={`test-${test.id}`}
                                        checked={!!completedTests[test.id]}
                                        onChange={() => toggleTest(test.id)}
                                        className="mt-1 h-5 w-5 bg-sat-blue border-sat-gray text-sat-accent focus:ring-sat-accent/50 rounded cursor-pointer shrink-0"
                                    />
                                    <label htmlFor={`test-${test.id}`} className={`flex-1 cursor-pointer transition-opacity ${completedTests[test.id] ? 'opacity-60' : 'opacity-100'}`}>
                                        <p className={`font-semibold text-sat-white ${completedTests[test.id] ? 'line-through' : ''}`}>Action: <span className="font-normal">{test.action}</span></p>
                                        <p className={`text-sm text-sat-lightgray mt-1 ${completedTests[test.id] ? 'line-through' : ''}`}>🎯 Expected Result: <span className="font-normal">{test.expected}</span></p>
                                    </label>
                                </div>
                                
                                <div className="pl-9 mt-4 space-y-3">
                                    <div>
                                        <label htmlFor={`actual-${test.id}`} className="block text-sm font-semibold text-sat-white mb-1">📝 Actual Result:</label>
                                        <textarea
                                            id={`actual-${test.id}`}
                                            value={testResults[test.id]?.actual || ''}
                                            onChange={(e) => handleResultChange(test.id, 'actual', e.target.value)}
                                            className="w-full bg-sat-blue text-sat-lightgray p-2 rounded-md border border-sat-gray focus:border-sat-accent focus:ring-1 focus:ring-sat-accent/50 text-sm font-mono"
                                            rows={2}
                                            placeholder="Document what actually happened..."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`notes-${test.id}`} className="block text-sm font-semibold text-sat-white mb-1">🗒️ Notes / Observations:</label>
                                        <textarea
                                            id={`notes-${test.id}`}
                                            value={testResults[test.id]?.notes || ''}
                                            onChange={(e) => handleResultChange(test.id, 'notes', e.target.value)}
                                            className="w-full bg-sat-blue text-sat-lightgray p-2 rounded-md border border-sat-gray focus:border-sat-accent focus:ring-1 focus:ring-sat-accent/50 text-sm"
                                            rows={2}
                                            placeholder="Any comments, bugs found, or suggestions..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};