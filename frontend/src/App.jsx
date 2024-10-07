import React, { useState, useRef, useCallback } from 'react';
import Map from './components/Map';
import Search from './components/Search';
import CoordinateInput from './components/CoordinateInput';
import axios from 'axios';
// import AcquisitionDates from './components/AcquisitionDates';
// import ThreeMonthCalendar from './components/Calanderview';
// import Date from './components/Date';

const App = () => {
	const [isUserTyping, setIsUserTyping] = useState(false);
	const [center, setCenter] = useState([51.505, -0.09]);
	const [zoom, setZoom] = useState(2);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [coordinates, setCoordinates] = useState({
		lat: '51.505',
		lng: '-0.09',
	});
	const [hasAutocentered, setHasAutocentered] = useState(false);
	const [showOlderNavBar, setShowOlderNavBar] = useState(false);
	const mapRef = useRef();

	console.log('isUserTyping:', isUserTyping);

	const handleUserTyping = useCallback(isTyping => {
		setIsUserTyping(isTyping);
	}, []);

	const handleLocationChange = useCallback(
		async (coordinates, displayName) => {
			const newZoom = calculateZoomLevel(coordinates);

			setSelectedLocation({ coordinates, displayName });

			setCoordinates({
				/* Resetting latitude and longitude here */
				lat: coordinates[0].toFixed(6),
				lng: coordinates[1].toFixed(6),
			});

			if (!displayName && !isUserTyping) {
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
		[isUserTyping]
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

	/*************  ✨ Codeium Command 🌟  *************/
	const handleZoomChange = newZoom => {
		/* Zoom level is being updated here */
		setZoom(newZoom);
		setZoom(newZoom); // Don't update center on zoom change
	};
	/******  88b208db-1688-46de-9d02-eabecf9315a3  *******/

	const handleCenterOnPin = () => {
		if (selectedLocation) {
			setCenter(selectedLocation.coordinates);
		}
	};

	console.log(coordinates);

	return (
		<div className="relative flex flex-col h-screen">
			<div className="absolute inset-x-0 top-0 z-20 backdrop-blur-sm bg-white/30 text-black flex items-center justify-between p-4 h-16 shadow-md rounded-3xl mt-3 mx-5">
				<h1 className="text-2xl ml-4 font-bold">SR-HUB</h1>
				<div className="flex items-center gap-x-4">
					<Search
						onLocationSelected={handleLocationChange}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						onUserTyping={handleUserTyping}
					/>
					<CoordinateInput
						onCoordinatesChanged={handleLocationChange}
						coordinates={coordinates}
						setCoordinates={setCoordinates}
					/>
				</div>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
					onClick={() => setShowOlderNavBar(!showOlderNavBar)}>
					{showOlderNavBar
						? 'Lock This Location'
						: 'Lock This Location'}
				</button>
			</div>
			{showOlderNavBar && (
				<div className="absolute inset-x-0 top-16 z-20 backdrop-blur-sm bg-white/30 text-black flex items-center justify-between p-4 h-16 shadow-md rounded-3xl mt-3 mx-5">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
						Dummy Button 1
					</button>
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
						Dummy Button 2
					</button>
				</div>
			)}

			<div className="flex-grow relative z-10">
				{/* <AcquisitionDates
					latitude={coordinates.lat}
					longitude={coordinates.lng}
				/> */}
				<Map
					center={center}
					zoom={zoom}
					ref={mapRef}
					selectedLocation={selectedLocation}
					onLocationChange={handleLocationChange}
					onZoomChange={handleZoomChange}
				/>
			</div>
			{/* <ThreeMonthCalendar /> */}
			{/* <Date /> */}
		</div>
	);
};

export default App;
