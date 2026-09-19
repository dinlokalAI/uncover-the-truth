
export enum GameStatus {
    START_MENU = 'START_MENU',
    LOADING = 'LOADING',
    PLAYING = 'PLAYING',
    VIDEO = 'VIDEO',
    GAME_OVER = 'GAME_OVER',
}

export type Scene = {
    description: string;
    imageUrl: string;
    objects: string[];
};

export type Inventory = string[];

export type BaseGameState = {
    status: GameStatus;
};

export type StartMenuState = BaseGameState & {
    status: GameStatus.START_MENU;
};

export type LoadingState = BaseGameState & {
    status: GameStatus.LOADING;
};

export type PlayingState = BaseGameState & {
    status: GameStatus.PLAYING;
    theme: string;
    scene: Scene;
    inventory: Inventory;
    narrativeHistory: string[];
};

export type VideoState = BaseGameState & {
    status: GameStatus.VIDEO;
    videoUrl: string;
    nextState: PlayingState;
};

export type GameOverState = BaseGameState & {
    status: GameStatus.GAME_OVER;
    finalMessage: string;
};

export type GameState = StartMenuState | LoadingState | PlayingState | VideoState | GameOverState;


// For Gemini Service
export type InitialSceneResult = {
    description: string;
    objects: string[];
    narrative: string;
}

export type InteractionResult = {
    narrative: string;
    newItem: string | null;
    removeItem: string | null;
    updatedObjects: string[];
    newSceneDescription: string | null;
    videoPrompt: string | null;
};
