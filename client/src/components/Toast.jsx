import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const bgColors = {
        success: 'bg-jade-900 border-jade-500 text-white',
        error: 'bg-red-950 border-red-500 text-white',
        info: 'bg-slate-900 border-emerald-500 text-white',
        warning: 'bg-amber-950 border-amber-500 text-amber-100'
    };

    const icons = {
        success: <FaCheckCircle className="text-jade-400 text-xl shrink-0" />,
        error: <FaExclamationCircle className="text-red-400 text-xl shrink-0" />,
        info: <FaInfoCircle className="text-emerald-400 text-xl shrink-0" />,
        warning: <FaExclamationCircle className="text-amber-400 text-xl shrink-0" />
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-popIn max-w-md">
            <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-md ${bgColors[type] || bgColors.info}`}>
                {icons[type]}
                <p className="text-sm font-semibold leading-snug flex-grow">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 hover:opacity-75 transition rounded-lg shrink-0 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default Toast;
