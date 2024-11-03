import React, { useState } from 'react';

const gifs = [
    '/gif1.mp4',
    '/gif2.mp4',
    '/gif3.mp4',
    '/gif4.mp4',
    '/gif6.mp4',
    '/gif5.mp4',
    '/gif7.mp4',
];

// Descriptions for each slide
const descriptions = [
    "Learn how to lock locations for easier access to data.",
    "Get notified on Mobile, Email, and WhatsApp when satellite passes are available in your locked area.",
    "Generate data for selected location based on user input: satellite choice, cloud coverage, and lead time.",
    "See location details: satellite view, scene id, cloud coverage and date.",
    "Generate SR profile for a particular satellite image of a locked location.",
    "Get all dates and times details when satellite passes are available in your locked area.",
    "Generate complete SR profile for a particular satellite image of a locked location."
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

                {/* Explanatory Text for Each Slide in Bold */}
                <p className="text-lg font-bold text-gray-700 mb-2">{descriptions[currentGif]}</p>

                {/* Carousel Display */}
                <div className="mb-4">
                    <video
                        src={gifs[currentGif]}
                        className="rounded-lg max-h-96 w-full" // Make video full width and limit height
                        autoPlay
                        loop={false}
                        muted
                        onEnded={nextGif} // Change to next video when the current one ends
                    />
                </div>

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
