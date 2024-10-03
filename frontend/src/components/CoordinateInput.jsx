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
			<input
				type="number"
				name="lat"
				value={coordinates.lat}
				onChange={handleChange}
				placeholder="Latitude"
				className="p-2 border rounded w-24"
			/>
			<input
				type="number"
				name="lng"
				value={coordinates.lng}
				onChange={handleChange}
				placeholder="Longitude"
				className="p-2 border rounded w-24"
			/>
		</div>
	);
};

export default CoordinateInput;
