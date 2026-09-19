
import React from 'react';

interface VideoPlayerProps {
    videoUrl: string;
    onVideoEnd: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onVideoEnd }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 animate-fade-in">
            <div className="w-full max-w-4xl p-4">
                <video
                    src={videoUrl}
                    autoPlay
                    className="w-full aspect-video rounded-lg shadow-2xl shadow-red-900/50"
                />
            </div>
            <button
                onClick={onVideoEnd}
                className="mt-6 bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-xl font-special transition-all duration-300"
            >
                Continue Investigation
            </button>
        </div>
    );
};

export default VideoPlayer;
