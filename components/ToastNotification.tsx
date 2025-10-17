import React, { useEffect } from 'react';

interface ToastNotificationProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto-dismiss after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    // Use Tailwind classes for enter/leave animations
    const toastClasses = `
        fixed bottom-5 right-5 z-50
        bg-sat-accent text-sat-blue 
        px-4 py-2 rounded-lg shadow-2xl 
        font-bold text-sm
        transition-all duration-300 ease-in-out
        transform
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'}
    `;

    return (
        <div className={toastClasses} role="alert" aria-live="assertive">
            {message}
        </div>
    );
};