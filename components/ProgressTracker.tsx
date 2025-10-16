import React from 'react';

// This is a placeholder for a future progress tracking component.
// It is not currently used in the application.

interface ProgressTrackerProps {
    steps: string[];
    currentStep: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, currentStep }) => {
    return (
        <div className="p-4 bg-sat-blue rounded-lg">
            <h3 className="text-lg font-bold text-sat-white mb-2">Progress</h3>
            <ol className="relative border-l border-sat-gray">
                {steps.map((step, index) => (
                     <li key={index} className="mb-6 ml-4">
                        <div className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border border-white ${index <= currentStep ? 'bg-sat-accent' : 'bg-sat-gray'}`}></div>
                        <h4 className={`font-semibold ${index <= currentStep ? 'text-sat-white' : 'text-sat-lightgray'}`}>{step}</h4>
                    </li>
                ))}
            </ol>
        </div>
    );
};
