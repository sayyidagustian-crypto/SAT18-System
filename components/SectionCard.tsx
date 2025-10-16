import React, { useState } from 'react';

interface SectionCardProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    startOpen?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);

    return (
        <div className="bg-sat-lightblue rounded-xl shadow-2xl border border-sat-gray w-full">
            <div 
                className="flex justify-between items-center p-4 sm:p-5 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h2 className="text-xl sm:text-2xl font-bold text-sat-white flex items-center gap-3">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-sat-accent" />
                    {title}
                </h2>
                <span className={`transform transition-transform duration-300 text-2xl text-sat-accent ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    ▼
                </span>
            </div>
             <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
                <div className="p-4 sm:p-6 pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
};
