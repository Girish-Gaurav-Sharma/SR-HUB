import React, { useState } from 'react';

const Download = ({ lat, long }) => {
	const [loading, setLoading] = useState({
		prediction: false,
		lastData: false,
		monthData: false,
		customData: false,
	});

	const handleGenerate = type => {
		setLoading(prevState => ({
			...prevState,
			[type]: true,
		}));
		setTimeout(() => {
			setLoading(prevState => ({
				...prevState,
				[type]: false,
			}));
		}, 3000);
	};

	return (
		<div className="download-component bg-white p-6 rounded-lg shadow-lg">
			<h2 className="text-2xl font-semibold mb-4">Download Options</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<button
					onClick={() => handleGenerate('prediction')}
					className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
					disabled={loading.prediction}>
					{loading.prediction ? (
						<svg
							className="animate-spin h-5 w-5 mr-3 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							{/* Spinner SVG paths */}
						</svg>
					) : null}
					{loading.prediction
						? 'Generating...'
						: 'Generate Prediction Calendar'}
				</button>

				<button
					onClick={() => handleGenerate('lastData')}
					className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center"
					disabled={loading.lastData}>
					{loading.lastData ? (
						<svg
							className="animate-spin h-5 w-5 mr-3 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							{/* Spinner SVG paths */}
						</svg>
					) : null}
					{loading.lastData
						? 'Loading...'
						: 'Last Data of All Satellites'}
				</button>

				<button
					onClick={() => handleGenerate('monthData')}
					className="bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 flex items-center justify-center"
					disabled={loading.monthData}>
					{loading.monthData ? (
						<svg
							className="animate-spin h-5 w-5 mr-3 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							{/* Spinner SVG paths */}
						</svg>
					) : null}
					{loading.monthData
						? 'Generating...'
						: 'Generate 1-Month Dataset'}
				</button>

				<button
					onClick={() => handleGenerate('customData')}
					className="bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 flex items-center justify-center"
					disabled={loading.customData}>
					{loading.customData ? (
						<svg
							className="animate-spin h-5 w-5 mr-3 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							{/* Spinner SVG paths */}
						</svg>
					) : null}
					{loading.customData
						? 'Generating...'
						: 'Generate Custom Dataset'}
				</button>
			</div>
		</div>
	);
};

export default Download;
