
import React, { useRef, useEffect } from 'react';

interface NarrativePanelProps {
    history: string[];
}

const NarrativePanel: React.FC<NarrativePanelProps> = ({ history }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [history]);

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <h3 className="text-xl font-special text-slate-300 mb-3 text-center">Log</h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {history.map((text, index) => (
                    <p key={index} className="text-slate-400 font-special text-lg leading-relaxed border-l-2 border-red-800 pl-3">
                        {text}
                    </p>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
};

export default NarrativePanel;
