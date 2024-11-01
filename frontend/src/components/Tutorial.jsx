import React, { useState, useEffect } from 'react';

const gifs = [
    '/gif1.mp4',
    '/gif2.mp4',
    '/gif1.mp4',
    '/gif4.mp4',
    '/gif1.mp4',
];

// Descriptions for each slide
const descriptions = [
    "Learn how to lock locations for easier access to data.",
    "Get notified when satellite passes are available in your locked area.",
    "Explore different acquisition dates available for satellite data.",
    "Get all dates and times details when satellite passes are available in your locked area.",
    "Understand how to manage and compare data over time."
];

const Tutorial = ({ onClose }) => {
    const [currentGif, setCurrentGif] = useState(0);
    const [showFinalButton, setShowFinalButton] = useState(false);

    // Function to change to the next GIF
    const nextGif = () => {
        setCurrentGif((prevIndex) => {
            const nextIndex = (prevIndex + 1) % gifs.length;

            // Show the final button when the carousel completes one full cycle
            if (nextIndex === 0) {
                setShowFinalButton(true);
            }

            return nextIndex;
        });
    };

    // Automatically change GIF every 7 seconds
    useEffect(() => {
        const intervalId = setInterval(nextGif, 16000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
            <div className="relative bg-white p-8 rounded-xl shadow-lg max-w-full max-h-full text-center">
                {/* Close Icon */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                    aria-label="Close tutorial"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4">Tutorial for SR-HUB</h2>
                <p className="mb-4">
                    Here you can explore satellite data, lock locations, and view acquisition dates. Let’s take a quick tour!
                </p>

                {/* Carousel Display */}
                <div className="mb-4">
                    <video
                        src={gifs[currentGif]}
                        className="rounded-lg max-h-96 w-full" // Make video full width and limit height
                        autoPlay
                        loop
                        muted
                    />
                </div>

                {/* Explanatory Text for Each Slide */}
                <p className="text-lg text-gray-700 mb-2">{descriptions[currentGif]}</p>

                {/* Next Button */}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-2"
                    onClick={nextGif}
                >
                    Next
                </button>

                {/* Show "Got it, thanks!" button only after completing one cycle */}
                {showFinalButton && (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded-full"
                        onClick={onClose}
                    >
                        Got it, thanks!
                    </button>
                )}
            </div>
        </div>
    );
};

export default Tutorial;
