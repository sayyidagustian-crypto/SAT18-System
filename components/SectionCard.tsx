
import React from 'react';

interface SectionCardProps {
    emoji: string;
    title: string;
    description: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({ emoji, title, description, children, onClick }) => {
    return (
        <div 
            className={`bg-sat-lightblue p-6 rounded-xl shadow-lg border border-sat-gray/50 flex flex-col h-full transform hover:scale-105 hover:border-sat-accent transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="mb-4">
                <span className="text-4xl" role="img" aria-label="icon">{emoji}</span>
                <h3 className="text-2xl font-bold mt-2 text-sat-white">{title}</h3>
                <p className="text-sm text-sat-lightgray">{description}</p>
            </div>
            <div className="flex-grow text-sat-white">
                {children}
            </div>
        </div>
    );
};
