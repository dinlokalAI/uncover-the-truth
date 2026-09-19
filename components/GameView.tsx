
import React from 'react';
import type { PlayingState } from '../types';
import Scene from './Scene';
import NarrativePanel from './NarrativePanel';
import InteractionPanel from './InteractionPanel';
import Inventory from './Inventory';

interface GameViewProps {
    gameState: PlayingState;
    onInteract: (object: string) => void;
}

const GameView: React.FC<GameViewProps> = ({ gameState, onInteract }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in max-h-[calc(100vh-2rem)]">
            <div className="lg:col-span-2 flex flex-col space-y-4">
                 <h1 className="text-2xl font-special text-red-500 text-center tracking-wider">{gameState.theme}</h1>
                <Scene imageUrl={gameState.scene.imageUrl} description={gameState.scene.description} />
                <InteractionPanel objects={gameState.scene.objects} onInteract={onInteract} />
            </div>
            <div className="lg:col-span-1 flex flex-col space-y-4 bg-slate-800/50 p-4 rounded-lg max-h-[calc(100vh-2rem)] overflow-hidden">
                <Inventory items={gameState.inventory} />
                <NarrativePanel history={gameState.narrativeHistory} />
            </div>
        </div>
    );
};

export default GameView;
