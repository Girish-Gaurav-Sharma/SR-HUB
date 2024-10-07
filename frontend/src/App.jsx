import React, { useState, useRef, useCallback, useEffect } from 'react';
import Map from './components/Map';
import Search from './components/Search';
import CoordinateInput from './components/CoordinateInput';
import axios from 'axios';
import 'antd/dist/reset.css'; // Ant Design styles

// import AcquisitionDates from './components/AcquisitionDates';
import ThreeMonthCalendar from './components/Calanderview';
// import Date from './components/Date';

const App = () => {
	const [isUserTyping, setIsUserTyping] = useState(false);
	const [showOlderNavBar, setShowOlderNavBar] = useState(true);
	const [showCanvas, setShowCanvas] = useState(false);
	const [activeTab, setActiveTab] = useState('AcquisitionDates');

	const [center, setCenter] = useState([51.505, -0.09]);
	const [zoom, setZoom] = useState(2);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [coordinates, setCoordinates] = useState({
		lat: '51.505',
		lng: '-0.09',
	});

	const mapRef = useRef();

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
					className="absolute inset-0 z-30 backdrop-blur-md flex items-center justify-center overflow-auto"
					style={{ maxHeight: '100vh' }}>
					<nav className="absolute inset-x-0 top-0 z-40 backdrop-blur-md bg-white/40 text-black flex items-center justify-between p-4 h-16 shadow-lg rounded-full mt-4 mx-6">
						<h1 className="text-2xl ml-4 font-bold tracking-wide">
							SR-HUB
						</h1>
						<div className="flex items-center gap-x-4">
							<button
								className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md ${
									activeTab === 'AcquisitionDates'
										? 'bg-blue-700'
										: ''
								}`}
								onClick={() =>
									setActiveTab('AcquisitionDates')
								}>
								Acquisition Dates
							</button>
							<button
								className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md ${
									activeTab === 'SatelliteCalendar'
										? 'bg-blue-700'
										: ''
								}`}
								onClick={() =>
									setActiveTab('SatelliteCalendar')
								}>
								Satellite Calendar
							</button>
							<button
								className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md ${
									activeTab === 'Date' ? 'bg-blue-700' : ''
								}`}
								onClick={() => setActiveTab('Date')}>
								Date
							</button>
						</div>
					</nav>
					<div
						className="absolute z-30 backdrop-blur-md bg-white/40 text-black p-6 overflow-y-auto h-[calc(100vh-7rem)] mt-8 rounded-3xl w-[calc(100vw-6rem)]  shadow-xl transition-all duration-300"
						style={{ top: '4rem' }}>
						{/* {activeTab === 'AcquisitionDates' && (
							<AcquisitionDates
								latitude={coordinates.lat}
								longitude={coordinates.lng}
							/>
						)} */}
						{activeTab === 'SatelliteCalendar' && (
							<ThreeMonthCalendar />
						)}
						{/* {activeTab === 'Date' && <Date />} */}
					</div>
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
