
import React from 'react';

interface StartMenuProps {
    onStart: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-special text-red-500 animate-flicker">GEMINI</h1>
            <h2 className="text-3xl md:text-5xl font-special text-slate-300 mb-2">CONSPIRACY</h2>
            <p className="text-slate-400 mb-8 max-w-2xl">
                A dynamic point-and-click adventure where the story is never the same. 
                Powered by dark arts and generative AI. The truth is procedurally generated.
            </p>
            <button
                onClick={onStart}
                className="bg-slate-700 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-2xl font-special transition-all duration-300 transform hover:scale-105"
            >
                Uncover The Truth
            </button>
        </div>
    );
};

export default StartMenu;
