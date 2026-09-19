
import { GoogleGenAI, Type } from "@google/genai";
import type { PlayingState, InitialSceneResult, InteractionResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const initialSceneSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING },
        objects: { type: Type.ARRAY, items: { type: Type.STRING } },
        narrative: { type: Type.STRING }
    },
    required: ["description", "objects", "narrative"]
};

const interactionResultSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.STRING,
            description: "A description of what happened when the player interacted with the object."
        },
        newItem: {
            type: Type.STRING,
            description: "An item added to inventory. Null if no item is found.",
            nullable: true,
        },
        removeItem: {
            type: Type.STRING,
            description: "An item removed from inventory (e.g., a used key). Null if no item is removed.",
            nullable: true,
        },
        updatedObjects: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The new list of interactive objects in the scene. Can be the same as before or updated."
        },
        newSceneDescription: {
            type: Type.STRING,
            description: "Description for a new scene if the player moves to a new location. Null otherwise.",
            nullable: true,
        },
        videoPrompt: {
            type: Type.STRING,
            description: "A short, dramatic prompt for a video clip if a major plot point occurs. Null otherwise.",
            nullable: true,
        }
    },
    required: ["narrative", "newItem", "removeItem", "updatedObjects", "newSceneDescription", "videoPrompt"]
};

export async function initGame(theme: string): Promise<InitialSceneResult> {
    const prompt = `You are a game master for a point-and-click conspiracy theory adventure game. 
    Generate the starting scene. The theme is: "${theme}". 
    Provide a detailed description of the first location, a list of 3-4 interactive objects, and a short introductory narrative that sets a mysterious tone.
    The narrative should hint at the conspiracy without revealing too much.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: initialSceneSchema,
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as InitialSceneResult;
    } catch (e) {
        console.error("Failed to parse initial scene JSON:", jsonText);
        throw new Error("Received malformed data from the conspiracy network.");
    }
}

export async function handleInteraction(gameState: PlayingState, clickedObject: string): Promise<InteractionResult> {
    const prompt = `You are a game master for a point-and-click adventure.
    The game's theme is: "${gameState.theme}".
    Current Scene: "${gameState.scene.description}".
    Player Inventory: ${gameState.inventory.length > 0 ? gameState.inventory.join(', ') : 'empty'}.
    Narrative so far: "${gameState.narrativeHistory[gameState.narrativeHistory.length - 1]}"
    
    The player interacts with: "${clickedObject}".

    Describe what happens next. The outcome should be logical within the conspiracy but mysterious and engaging. 
    - If the player finds something, specify it as newItem.
    - If an inventory item is used, specify it as removeItem.
    - If the interaction reveals something cinematic, provide a short, dramatic prompt for a video generator (e.g., "A hidden projector activates, showing grainy footage of a UFO landing").
    - If the player enters a new area, provide a new scene description.
    - Update the list of interactive objects in the current scene accordingly.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interactionResultSchema,
        }
    });

    const jsonText = response.text.trim();
    try {
        const parsed = JSON.parse(jsonText);
        // Handle Gemini sometimes returning "null" as a string
        if (parsed.newItem === "null") parsed.newItem = null;
        if (parsed.removeItem === "null") parsed.removeItem = null;
        if (parsed.newSceneDescription === "null") parsed.newSceneDescription = null;
        if (parsed.videoPrompt === "null") parsed.videoPrompt = null;
        return parsed as InteractionResult;
    } catch (e) {
        console.error("Failed to parse interaction result JSON:", jsonText);
        throw new Error("Received a garbled transmission. The agents may be jamming our signals.");
    }
}


export async function generateImage(prompt: string): Promise<string> {
    const fullPrompt = `A photorealistic, atmospheric, and mysterious illustration for a point-and-click adventure game. The scene is: ${prompt}. The style should be like a gritty detective noir film, with high contrast lighting and deep shadows.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
}


export async function generateVideo(prompt: string): Promise<string> {
    const fullPrompt = `A cinematic, mysterious, short video clip for a conspiracy theory adventure game. ${prompt}. No text or logos. Gritty, found-footage style.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: fullPrompt,
        config: { numberOfVideos: 1 }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed to produce a download link.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
}
