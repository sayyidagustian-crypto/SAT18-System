import React from 'react';

// This is a placeholder for a future terminal emulation component.
// It is not currently used in the application.

export const Terminal: React.FC = () => {
    return (
        <div className="bg-black text-green-400 font-mono p-4 rounded-lg h-64 border border-gray-700">
            <p>&gt; This is a terminal placeholder.</p>
            <p>&gt; Future functionality could include running scripts directly.</p>
            <span className="animate-pulse">_</span>
        </div>
    );
};
