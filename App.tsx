
import React, { useState, useCallback, useEffect } from 'react';
import type { GameState, Scene, Inventory, InteractionResult } from './types';
import { GameStatus } from './types';
import { CONSPIRACY_THEMES, LOADING_MESSAGES } from './constants';
import * as geminiService from './services/geminiService';
import StartMenu from './components/StartMenu';
import GameView from './components/GameView';
import LoadingView from './components/LoadingView';
import VideoPlayer from './components/VideoPlayer';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({ status: GameStatus.START_MENU });
    const [loadingMessage, setLoadingMessage] = useState<string>('Initializing...');
    const [error, setError] = useState<string | null>(null);

    const handleStartGame = useCallback(async () => {
        setError(null);
        setGameState({ status: GameStatus.LOADING });
        setLoadingMessage('Generating a new conspiracy...');

        try {
            const theme = CONSPIRACY_THEMES[Math.floor(Math.random() * CONSPIRACY_THEMES.length)];
            const initialSceneData = await geminiService.initGame(theme);

            setLoadingMessage('Illustrating the scene...');
            const imageUrl = await geminiService.generateImage(initialSceneData.description);

            setGameState({
                status: GameStatus.PLAYING,
                theme: theme,
                scene: {
                    description: initialSceneData.description,
                    imageUrl: imageUrl,
                    objects: initialSceneData.objects
                },
                inventory: [],
                narrativeHistory: [initialSceneData.narrative]
            });
        } catch (err) {
            console.error(err);
            setError('Failed to start the game. The truth is being hidden from us. Please try again.');
            setGameState({ status: GameStatus.START_MENU });
        }
    }, []);

    const handleInteraction = useCallback(async (object: string) => {
        if (gameState.status !== GameStatus.PLAYING) return;
        
        setError(null);
        const currentState = { ...gameState }; // capture state before setting to loading
        setGameState({ status: GameStatus.LOADING });
        setLoadingMessage('Investigating...');

        try {
            const result = await geminiService.handleInteraction(currentState, object);

            const newInventory = [...currentState.inventory];
            if (result.newItem && !newInventory.includes(result.newItem)) {
                newInventory.push(result.newItem);
            }
            if (result.removeItem) {
                const itemIndex = newInventory.indexOf(result.removeItem);
                if (itemIndex > -1) {
                    newInventory.splice(itemIndex, 1);
                }
            }

            const newHistory = [...currentState.narrativeHistory, result.narrative];

            if (result.videoPrompt) {
                setLoadingMessage('A crucial event is unfolding...');
                const videoUrl = await geminiService.generateVideo(result.videoPrompt);
                setGameState({
                    status: GameStatus.VIDEO,
                    videoUrl,
                    nextState: {
                        ...currentState,
                        status: GameStatus.PLAYING,
                        inventory: newInventory,
                        narrativeHistory: newHistory,
                        scene: { ...currentState.scene, objects: result.updatedObjects }
                    }
                });
            } else if (result.newSceneDescription) {
                setLoadingMessage('Moving to a new location...');
                const newImageUrl = await geminiService.generateImage(result.newSceneDescription);
                setGameState({
                    ...currentState,
                    status: GameStatus.PLAYING,
                    inventory: newInventory,
                    narrativeHistory: newHistory,
                    scene: {
                        description: result.newSceneDescription,
                        imageUrl: newImageUrl,
                        objects: result.updatedObjects
                    }
                });
            } else {
                setGameState({
                    ...currentState,
                    status: GameStatus.PLAYING,
                    inventory: newInventory,
                    narrativeHistory: newHistory,
                    scene: { ...currentState.scene, objects: result.updatedObjects }
                });
            }

        } catch (err) {
            console.error(err);
            setError('Something went wrong. A shadowy figure may be interfering. Please try again.');
            setGameState(currentState); // Revert to previous state on error
        }

    }, [gameState]);

    const handleVideoEnd = useCallback(() => {
        if (gameState.status === GameStatus.VIDEO) {
            setGameState(gameState.nextState);
        }
    }, [gameState]);


    const renderContent = () => {
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-screen text-center">
                    <p className="text-red-400 text-2xl font-special mb-4">{error}</p>
                    <button
                        onClick={handleStartGame}
                        className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-xl font-special transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        
        switch (gameState.status) {
            case GameStatus.START_MENU:
                return <StartMenu onStart={handleStartGame} />;
            case GameStatus.LOADING:
                return <LoadingView message={loadingMessage} />;
            case GameStatus.PLAYING:
                return <GameView gameState={gameState} onInteract={handleInteraction} />;
            case GameStatus.VIDEO:
                return <VideoPlayer videoUrl={gameState.videoUrl} onVideoEnd={handleVideoEnd} />;
            default:
                return <StartMenu onStart={handleStartGame} />;
        }
    };

    return (
        <main className="min-h-screen bg-slate-900 font-sans p-4">
            <div className="container mx-auto max-w-7xl">
                {renderContent()}
            </div>
        </main>
    );
};

export default App;
