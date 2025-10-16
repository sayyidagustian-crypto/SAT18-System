import React from 'react';

interface IconProps {
    className?: string;
}

export const RobotIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 7a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zM9 12a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
        <path fillRule="evenodd" d="M4.5 9.5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h.5a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5h-.5zM15.5 9.5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h.5a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5h-.5z" clipRule="evenodd" />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

export const KnowledgeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.242.748-.242 1.069 0l6 4.5c.32.242.513.64.513 1.06v5.112c0 .42-.193.818-.513 1.06l-6 4.5c-.32.242-.748-.242-1.069 0l-6-4.5A1.5 1.5 0 012.25 13.556V8.444c0-.42.193-.818.513-1.06l6-4.5zM4.31 8.444L10 4.333l5.69 4.111v5.112L10 17.667l-5.69-4.111V8.444z" clipRule="evenodd" />
    </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
);

export const InboxStackIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path d="M3.75 4.5A.75.75 0 003 5.25v9a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75v-9a.75.75 0 00-.75-.75H3.75z" />
        <path fillRule="evenodd" d="M18.75 3A.75.75 0 0018 3.75v.066c.35.132.673.333.938.579.27.25.468.564.562.915V5.25A2.25 2.25 0 0017.25 3H3.75A2.25 2.25 0 001.5 5.25v9A2.25 2.25 0 003.75 16.5h13.5A2.25 2.25 0 0019.5 14.25v-.04a1.5 1.5 0 01-1.06-1.06c-.03-.12-.054-.242-.072-.365A2.253 2.253 0 0118 12.5v-1.19a.75.75 0 00-.75-.75H3.75a.75.75 0 000 1.5h13.5a.75.75 0 00.75.75v1.19c0 .064.004.128.012.19.06.442.272.836.59 1.121.23.208.495.37.783.486v.04A2.25 2.25 0 0017.25 18H3.75A2.25 2.25 0 001.5 15.75V5.25A2.25 2.25 0 003.75 3h13.5c.34 0 .666.082.96.223.23.109.444.25.625.419V3.75A.75.75 0 0018.75 3z" clipRule="evenodd" />
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.25a.75.75 0 01-1.5 0V1.75A.75.75 0 0110 1zM8.857 3.643a.75.75 0 01.092 1.058l-1.02 1.482a.75.75 0 01-1.15-.796l1.02-1.482a.75.75 0 011.058-.262zM12.102 4.7a.75.75 0 011.15.796l-1.02 1.482a.75.75 0 01-1.15-.796l1.02-1.482zM4.7 12.102a.75.75 0 01.796-1.15l1.482 1.02a.75.75 0 01-.796 1.15l-1.482-1.02zM15.299 11.043a.75.75 0 01.262 1.058l-1.482 1.02a.75.75 0 01-1.058-.262l1.482-1.02a.75.75 0 01.796-.796zM10 18a8 8 0 100-16 8 8 0 000 16zM8.433 13.408a.75.75 0 01-1.232.792l-1.5-2.25a.75.75 0 011.232-.792l.835 1.253 1.6-2.4a.75.75 0 011.232.792l-2.135 3.2z" clipRule="evenodd" />
    </svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.204 2.82l-1.396-1.396a.75.75 0 111.06-1.06l1.396 1.396a4 4 0 006.49-3.212.75.75 0 011.342.654zm-10.624-2.848a5.5 5.5 0 019.204-2.82l1.396 1.396a.75.75 0 001.06-1.06L14.95 4.7a4 4 0 00-6.49 3.212.75.75 0 01-1.342-.654z" clipRule="evenodd" />
    </svg>
);

export const AuditIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path d="M10 3.5A1.5 1.5 0 0111.5 5v.55a2.5 2.5 0 012.352 2.352H14.4a1.5 1.5 0 010 3h-.55a2.5 2.5 0 01-2.352 2.352v.55a1.5 1.5 0 01-3 0v-.55a2.5 2.5 0 01-2.352-2.352H5.6a1.5 1.5 0 010-3h.55A2.5 2.5 0 018.5 5.55v-.55A1.5 1.5 0 0110 3.5zM9.55 5.55a1 1 0 00-.55.888V6.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-.062a1 1 0 00-.55-.888A3.99 3.99 0 0012.45 5H8.55a3.99 3.99 0 00-1.062.438z" />
        <path fillRule="evenodd" d="M8.25 10.5a.75.75 0 01.75-.75h2a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        <path d="M5.01 12.2A1.5 1.5 0 016.5 13.5v.55a2.5 2.5 0 012.352 2.352H9.4a1.5 1.5 0 010 3h1.2a1.5 1.5 0 010-3h-.55a2.5 2.5 0 01-2.352-2.352v-.55a1.5 1.5 0 01-1.488-1.501z" />
    </svg>
);

export const UndoIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01.028 1.06l-2.23 2.468H14.25a.75.75 0 010 1.5H5.59l2.23 2.468a.75.75 0 11-1.088 1.028l-3.5-3.85a.75.75 0 010-1.028l3.5-3.85a.75.75 0 011.06.028zM12.207 17.768a.75.75 0 01-.028-1.06l2.23-2.468H5.75a.75.75 0 010-1.5h8.66l-2.23-2.468a.75.75 0 011.088-1.028l3.5 3.85a.75.75 0 010 1.028l-3.5 3.85a.75.75 0 01-1.06-.028z" clipRule="evenodd" />
    </svg>
);

export const TestTubeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.68l3.963 7.925a2.25 2.25 0 01-2.013 3.145H7.299a2.25 2.25 0 01-2.013-3.145L9.25 6.43V2.75A.75.75 0 0110 2zM8.5 6.5a.5.5 0 000 1h3a.5.5 0 000-1h-3zM8 9a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2A.5.5 0 018 9z" clipRule="evenodd" />
    </svg>
);
