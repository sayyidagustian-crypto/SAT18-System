import React from 'react';

interface IconProps {
    className?: string;
}

export const RobotIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A12.025 12.025 0 0010 18a12.025 12.025 0 006.126-2.095 1.23 1.23 0 00.41-1.412A9.982 9.982 0 0010 12a9.982 9.982 0 00-6.535 2.493z" />
    </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path d="M7.5 1.75a.75.75 0 00-1.5 0V2.5A3.5 3.5 0 002.5 6v2.5a.75.75 0 001.5 0V6A2 2 0 016 4V2.75a.75.75 0 00-.5-.715v-.01zM14 2.75a.75.75 0 00-1.5 0V4A2 2 0 0110.5 6v2.5a.75.75 0 001.5 0V6A3.5 3.5 0 0015.5 2.5V1.75a.75.75 0 00-1.5 0v.02z" />
      <path fillRule="evenodd" d="M2.5 8.5A.75.75 0 004 9.25v2a3.5 3.5 0 003.5 3.5h5A3.5 3.5 0 0016 11.25v-2a.75.75 0 001.5 0v2A5 5 0 0112.5 16h-5A5 5 0 012.5 11v-2.5z" clipRule="evenodd" />
    </svg>
);

export const RoadmapIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.03-5.22a.75.75 0 010-1.06l1.25-1.25a.75.75 0 011.06 0l1.25 1.25a.75.75 0 01-1.06 1.06L11.5 11.81v4.44a.75.75 0 01-1.5 0v-4.44l-.72.72a.75.75 0 01-1.06 0zM10 2.5a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V3.25A.75.75 0 0110 2.5zM7.5 5a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5z" clipRule="evenodd" />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path d="M13 4.5a2.5 2.5 0 11.702 4.289l-3.41 1.894a2.5 2.5 0 110 2.634l3.41 1.894A2.5 2.5 0 1113 15.5V4.5zM4.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9-11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-5 h-5"}>
      <path d="M9.25 2.75a.75.75 0 00-1.5 0v8.614L4.795 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
);
