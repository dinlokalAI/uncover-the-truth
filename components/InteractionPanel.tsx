
import React from 'react';

interface InteractionPanelProps {
    objects: string[];
    onInteract: (object: string) => void;
}

const InteractionPanel: React.FC<InteractionPanelProps> = ({ objects, onInteract }) => {
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border-2 border-slate-700">
            <h3 className="text-xl font-special text-slate-300 mb-3 text-center">What do you do?</h3>
            <div className="flex flex-wrap gap-3 justify-center">
                {objects.map((obj, index) => (
                    <button
                        key={index}
                        onClick={() => onInteract(obj)}
                        className="bg-slate-700 hover:bg-red-700 text-slate-200 font-semibold py-2 px-4 rounded-md transition-all duration-200 transform hover:-translate-y-1"
                    >
                        {obj}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InteractionPanel;
