import React from 'react';

// Icon components accept className to allow for styling flexibility.
interface IconProps {
    className?: string;
}

export const NodeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.2,9.6c-0.1-0.1-0.2-0.2-0.3-0.2c-0.5-0.5-1.2-0.8-1.9-0.8H18V7.2c0-0.6-0.5-1-1-1h-2.5c-0.6,0-1,0.5-1,1V10h-3V7.2c0-0.6-0.5-1-1-1H7C6.5,6.2,6,6.7,6,7.2V10H4c-0.6,0-1,0.5-1,1v2c0,0.6,0.5,1,1,1h2v1.8c0,0.6,0.5,1,1,1h2.5c0.6,0,1-0.5,1-1V14h3v1.8c0,0.6,0.5,1,1,1H17c0.6,0,1-0.5,1-1V14h2c0.8,0,1.5-0.3,1.9-0.8c0.1-0.1,0.2-0.2,0.3-0.2c0.3-0.4,0.3-1,0-1.4L22.2,9.6z M12.5,11.8c0,0.6-0.5,1-1,1H9c-0.6,0-1-0.5-1-1V9.2c0-0.6,0.5-1,1-1h2.5c0.6,0,1,0.5,1,1V11.8z" />
    </svg>
);

export const ReactIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className={className}>
        <circle cx="256" cy="256" r="32" />
        <path d="M449.6,256c0-107.2-86.4-193.6-193.6-193.6S62.4,148.8,62.4,256c0,28.8,6.4,56,17.6,81.6l-16,33.6c-4.8,9.6,4.8,20.8,16,16l33.6-16c25.6,11.2,52.8,17.6,81.6,17.6s56-6.4,81.6-17.6l33.6,16c9.6,4.8,20.8-4.8,16-16l-16-33.6C443.2,312,449.6,284.8,449.6,256z M256,352c-52.8,0-96-43.2-96-96s43.2-96,96-96s96,43.2,96,96S308.8,352,256,352z" />
    </svg>
);


export const LaravelIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.29,3.23,2.41,17.27a1,1,0,0,0,1.4,1.43L6,16.89V18a1,1,0,0,0,1,1H19.5a1,1,0,0,0,1-1V9.75a1,1,0,0,0-.5-.87L12.71,3.22A1,1,0,0,0,11.29,3.23ZM14,12.5v2H10v-2ZM7.08,13,12,4.8,17,8.25V9H7.08Zm-.19,2H17v1H6.89Z" />
    </svg>
);

export const DockerIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.2,12.6c-0.2-1-0.8-1.9-1.6-2.6c0-0.1,0-0.1,0-0.2c-0.2-1.3-0.8-2.4-1.8-3.3c-0.2-0.2-0.4-0.3-0.7-0.5 c-0.8-0.5-1.7-0.8-2.6-0.8c-0.6,0-1.1,0.1-1.6,0.3c-0.2,0.1-0.4,0.2-0.6,0.3c-1,0.7-1.8,1.7-2.1,2.9c0,0,0,0.1,0,0.1 c-0.5-0.2-1-0.2-1.5-0.2c-1.6,0-3.1,0.6-4.2,1.7c-0.5,0.5-0.9,1.1-1.2,1.8C1.5,12.8,1,14.1,1,15.4c0,2.4,1.5,4.5,3.6,5.3 C4.8,20.8,5,20.9,5.3,21h13.4c0.3,0,0.5-0.1,0.8-0.2c2.1-0.8,3.6-2.9,3.6-5.3C23,14.1,22.7,13.3,22.2,12.6z M13,11h3v2h-3V11z M9,11h3v2H9V11z M9,8h3v2H9V8z M5,11h3v2H5V11z M5,8h3v2H5V8z M13,8h3v2h-3V8z" />
    </svg>
);