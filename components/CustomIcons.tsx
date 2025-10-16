import React from 'react';

export const RobotIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12,2A2,2,0,0,0,10,4V6H4A2,2,0,0,0,2,8V14H4V20A2,2,0,0,0,6,22H18A2,2,0,0,0,20,20V14H22V8A2,2,0,0,0,20,6H14V4A2,2,0,0,0,12,2ZM8,14V18H6V14ZM18,18H16V14H18Z" />
        <circle cx="8.5" cy="11.5" r="1.5" />
        <circle cx="15.5" cy="11.5" r="1.5" />
    </svg>
);

export const HistoryIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7v2a9 9 0 0 0 9-9 9 9 0 0 0-9-9z"/>
        <path d="M12 8v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </svg>
);

export const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M15.5 8.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M5.023 11.006a.75.75 0 01.385.659 3.493 3.493 0 003.18 2.585 3.493 3.493 0 003.18-2.585.75.75 0 011.28-.518 5 5 0 01-4.46 3.853 5 5 0 01-4.46-3.853.75.75 0 01.9-1.141z" clipRule="evenodd" />
    </svg>
);

export const RoadmapIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M4 2a1 1 0 00-1 1v1.586l2.293 2.293a1 1 0 001.414 0l1.414-1.414A1 1 0 009 5V3a1 1 0 00-1-1H4zm11 0a1 1 0 00-1 1v2a1 1 0 00.586.914l1.414 1.414a1 1 0 001.414 0L19.707 5.02A1 1 0 0020 4.172V3a1 1 0 00-1-1h-4zM4.707 10.293a1 1 0 00-1.414 0L1 12.586V14a1 1 0 001 1h2a1 1 0 00.914-.586l1.414-1.414a1 1 0 000-1.414L4.707 10.293zM11 11a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2zM15.293 10.293a1 1 0 00-1.414 0l-1.414 1.414A1 1 0 0013 13v2a1 1 0 001 1h2a1 1 0 001-1v-1.586l2.293-2.293a1 1 0 000-1.414L15.293 10.293z" clipRule="evenodd" />
    </svg>
);