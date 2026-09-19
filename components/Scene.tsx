
import React from 'react';

interface SceneProps {
    imageUrl: string;
    description: string;
}

const Scene: React.FC<SceneProps> = ({ imageUrl, description }) => {
    return (
        <div className="aspect-video w-full bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700 shadow-lg">
            <img src={imageUrl} alt={description} className="w-full h-full object-cover" />
        </div>
    );
};

export default Scene;
