import React, { useState, useRef, useCallback } from 'react';
import Map from './components/Map';
import Search from './components/Search';
import CoordinateInput from './components/CoordinateInput';
import axios from 'axios';
import AcquisitionDates from './components/AcquisitionDates';

const App = () => {
	const [center, setCenter] = useState([51.505, -0.09]);
	const [zoom, setZoom] = useState(2);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [coordinates, setCoordinates] = useState({
		lat: '51.505',
		lng: '-0.09',
	});
	const [hasAutocentered, setHasAutocentered] = useState(false);
	const mapRef = useRef();

	const handleLocationChange = useCallback(
		async (coordinates, displayName, shouldAutocenter = true) => {
			const newZoom = calculateZoomLevel(coordinates);

			setSelectedLocation({ coordinates, displayName });

			if (shouldAutocenter && !hasAutocentered) {
				setCenter(coordinates);
				mapRef.current.flyTo(coordinates, newZoom, { duration: 1 });
				setHasAutocentered(true);
			}

			setCoordinates({
				lat: coordinates[0].toFixed(6),
				lng: coordinates[1].toFixed(6),
			});

			if (!displayName) {
				try {
					const response = await axios.get(
						`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[0]}&lon=${coordinates[1]}`
					);
					setSearchQuery(response.data.display_name);
				} catch (error) {
					console.error('Error in reverse geocoding:', error);
					setSearchQuery('');
				}
			} else {
				setSearchQuery(displayName);
			}
		},
		[hasAutocentered]
	);

	const calculateZoomLevel = coordinates => {
		const [lat, lon] = coordinates;
		const latAbs = Math.abs(lat);
		const lonAbs = Math.abs(lon);

		if (latAbs < 0.01 && lonAbs < 0.01) return 18;
		if (latAbs < 0.1 && lonAbs < 0.1) return 15;
		if (latAbs < 1 && lonAbs < 1) return 10;
		return 6;
	};

	const handleZoomChange = newZoom => {
		setZoom(newZoom);
	};

	const handleCenterOnPin = () => {
		if (selectedLocation) {
			const newZoom = calculateZoomLevel(selectedLocation.coordinates);
			setCenter(selectedLocation.coordinates);
			mapRef.current.flyTo(selectedLocation.coordinates, newZoom, {
				duration: 1,
			});
		}
	};
	console.log(coordinates);
	return (
		<div className="relative flex flex-col h-screen">
			<div className="absolute inset-x-0 top-0 z-20 backdrop-blur-sm bg-white/30 text-black flex items-center justify-between p-4 h-16 shadow-md rounded-3xl mt-3 mx-5">
				<h1 className="text-2xl font-bold">Interactive Map</h1>
				{/* <Search
					onLocationSelected={handleLocationChange}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/> */}
				{/* <CoordinateInput
					onCoordinatesChanged={handleLocationChange}
					coordinates={coordinates}
					setCoordinates={setCoordinates}
				/> */}
				<button
					onClick={handleCenterOnPin}
					className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
					disabled={!selectedLocation}>
					Center on Pin
				</button>
			</div>

			<div className="flex-grow relative z-10">
				<AcquisitionDates
					latitude={coordinates.lat}
					longitude={coordinates.lng}
				/>
				<Map
					center={center}
					zoom={zoom}
					ref={mapRef}
					selectedLocation={selectedLocation}
					onLocationChange={handleLocationChange}
					onZoomChange={handleZoomChange}
				/>
			</div>
		</div>
	);
};

export default App;
