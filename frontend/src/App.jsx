import React, { useState, useRef, useCallback, useEffect } from 'react';
import Map from './components/Map';
import Search from './components/Search';
import CoordinateInput from './components/CoordinateInput';
import axios from 'axios';
import AcquisitionDates from './components/AcquisitionDates';
// import ThreeMonthCalendar from './components/Calanderview';
import Date from './components/Date';

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
	const mapRef = useRef();
	const [showOlderNavBar, setShowOlderNavBar] = useState(true);
	const [showCanvas, setShowCanvas] = useState(false);

	const handleCoordinatesChange = useCallback(() => {
		if (mapRef.current) {
			mapRef.current.flyTo([coordinates.lat, coordinates.lng], 8, {
				animate: true,
			});
		}
	}, [coordinates, mapRef]);

	useEffect(() => {
		handleCoordinatesChange();
	}, [handleCoordinatesChange]);

	console.log('isUserTyping:', isUserTyping);

	const handleUserTyping = useCallback(isTyping => {
		setIsUserTyping(isTyping);
	}, []);

	const handleLocationChange = useCallback(
		async (coordinates, displayName) => {
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

	const handleZoomChange = newZoom => {
		setZoom(newZoom);
	};

	console.log(coordinates);

	return (
		<div className="relative flex flex-col h-screen">
			{showOlderNavBar && (
				<nav className="absolute inset-x-0 top-0 z-20 backdrop-blur-sm bg-white/30 text-black flex items-center justify-between p-4 h-16 shadow-md rounded-3xl mt-3 mx-5">
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
						onClick={() => {
							setShowOlderNavBar(!showOlderNavBar);
							setShowCanvas(!showCanvas);
						}}>
						Lock This Location
					</button>
				</nav>
			)}

			{showCanvas && (
				<div
					className="absolute inset-0 z-30 backdrop-blur-sm flex items-center justify-center overflow-auto"
					style={{ maxHeight: '100vh' }}>
					<div className="flex flex-col">
						<nav className="absolute inset-x-0 top-0 z-30 backdrop-blur-sm bg-white/30 text-black flex items-center justify-between p-4 h-16 shadow-md rounded-3xl mt-3 mx-5">
							<h1 className="text-2xl ml-4 font-bold">SR-HUB</h1>
						</nav>
						<nav className="absolute inset-x-0 top-10 z-30 backdrop-blur-sm bg-white/30 text-black flex items-center justify-between p-4 h-16 shadow-md rounded-3xl mt-3 mx-5">
							<h1 className="text-2xl ml-4 font-bold">SR-HUB</h1>
						</nav>
					</div>
					{/* <AcquisitionDates
						latitude={coordinates.lat}
						longitude={coordinates.lng}
					/>
					<ThreeMonthCalendar />
					<Date /> */}
				</div>
			)}

			<div className="flex-grow relative z-10">
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
