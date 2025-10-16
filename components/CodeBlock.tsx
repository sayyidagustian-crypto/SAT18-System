
import React from 'react';

interface CodeBlockProps {
    code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
    return (
        <pre className="bg-sat-blue p-4 rounded-lg text-sm text-sat-lightgray overflow-x-auto">
            <code>{code}</code>
        </pre>
    );
};
