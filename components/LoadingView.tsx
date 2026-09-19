
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

interface LoadingViewProps {
    message: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({ message }) => {
    const [dynamicMessage, setDynamicMessage] = useState<string>('');

    useEffect(() => {
        setDynamicMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
        const intervalId = setInterval(() => {
            setDynamicMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center animate-fade-in">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500 mb-6"></div>
            <h2 className="text-3xl font-special text-slate-300 mb-2">{message}</h2>
            <p className="text-slate-400 font-special animate-pulse-slow">{dynamicMessage}</p>
        </div>
    );
};

export default LoadingView;
