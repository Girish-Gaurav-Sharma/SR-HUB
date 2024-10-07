import React, { useEffect } from 'react';

const CoordinateInput = ({
	onCoordinatesChanged,
	coordinates,
	setCoordinates,
}) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			if (coordinates.lat && coordinates.lng) {
				onCoordinatesChanged([
					parseFloat(coordinates.lat),
					parseFloat(coordinates.lng),
				]);
			}
		}, 1000); // 1 second delay

		return () => clearTimeout(timer);
	}, [coordinates, onCoordinatesChanged]);

	const handleChange = e => {
		const { name, value } = e.target;
		setCoordinates(prev => ({ ...prev, [name]: value }));
	};

	return (
		<div className="flex space-x-2">
			<div className="flex items-center text-lg font-semibold text-gray-800">
				Coordinates
			</div>

			<input
				type="number"
				name="lat"
				value={coordinates.lat}
				onChange={handleChange}
				placeholder="Latitude"
				className="pl-4 pr-4 border border-gray-300 rounded-3xl w-32 h-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
			/>
			<input
				type="number"
				name="lng"
				value={coordinates.lng}
				onChange={handleChange}
				placeholder="Longitude"
				className="pl-4 pr-4 border border-gray-300 rounded-3xl w-32 h-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
			/>
		</div>
	);
};

export default CoordinateInput;
