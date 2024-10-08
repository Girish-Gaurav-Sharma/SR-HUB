import React, { useState, useRef, useCallback, useEffect } from 'react';
import Map from './components/Map';
import Search from './components/Search';
import CoordinateInput from './components/CoordinateInput';
import axios from 'axios';
import 'antd/dist/reset.css'; // Ant Design styles
import Download from './components/download';
// import AcquisitionDates from './components/AcquisitionDates';
import ThreeMonthCalendar from './components/Calanderview';
import Date from './components/Date';
import NotificationSignupPage from './components/Form';

const App = () => {
	const [isUserTyping, setIsUserTyping] = useState(false);
	const [showOlderNavBar, setShowOlderNavBar] = useState(true);
	const [showCanvas, setShowCanvas] = useState(false);
	const [activeTab, setActiveTab] = useState('AcquisitionDates');
	const [showNewNavBar, setShowNewNavBar] = useState(false);

	// Set the initial coordinates to Cheapside Farm
	const [center, setCenter] = useState([53.504, -0.0669]);
	const [zoom, setZoom] = useState(8);

	// Initialize coordinates with Cheapside Farm's location
	const [coordinates, setCoordinates] = useState({
		lat: '53.5040',
		lng: '-0.0669',
	});

	// Initialize selectedLocation with the desired displayName and coordinates
	const [selectedLocation, setSelectedLocation] = useState({
		coordinates: [53.504, -0.0669],
		displayName:
			'Cheapside, Cheapside Farm, Waltham, North East Lincolnshire, England, DN37 0FJ, United Kingdom',
	});

	// Set the initial search query to the displayName
	const [searchQuery, setSearchQuery] = useState(
		'Cheapside, Cheapside Farm, Waltham, North East Lincolnshire, England, DN37 0FJ, United Kingdom'
	);

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

	const LocationInfoBar = ({ locationName, coordinates }) => (
		<div
			className="backdrop-blur-md bg-white/40 text-black flex items-center justify-center p-2 h-12 shadow-lg rounded-full mx-6 mt-4"
			style={{ width: 'calc(100% - 3rem)' }}>
			<p className="text-lg font-semibold">
				You have locked your location to {locationName} (
				{parseFloat(coordinates.lat).toFixed(4)},{' '}
				{parseFloat(coordinates.lng).toFixed(4)})
			</p>
		</div>
	);

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
							setShowOlderNavBar(false);
							setShowCanvas(true);
							setShowNewNavBar(false);
						}}>
						Lock This Location
					</button>
				</nav>
			)}

			{showCanvas && (
				<div
					className="absolute inset-0 z-30 backdrop-blur-md flex flex-col items-center justify-start overflow-auto"
					style={{ maxHeight: '100vh' }}>
					{showNewNavBar && (
						<nav
							className="backdrop-blur-md bg-white/40 text-black flex items-center justify-between p-4 h-16 shadow-lg rounded-full mt-4 mx-6"
							style={{ width: 'calc(100% - 3rem)' }}>
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
									Turn On Notifications
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
									Overpass Calendar
								</button>
								<button
									className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md ${
										activeTab === 'Date'
											? 'bg-blue-700'
											: ''
									}`}
									onClick={() => setActiveTab('Date')}>
									Data
								</button>
								<button
									className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md ${
										activeTab === 'GenerateData'
											? 'bg-blue-700'
											: ''
									}`}
									onClick={() =>
										setActiveTab('GenerateData')
									}>
									Generate Data
								</button>
							</div>
							<button
								className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md"
								onClick={() => {
									setShowOlderNavBar(true);
									setShowCanvas(false);
									setShowNewNavBar(false);
								}}>
								Change Location
							</button>
						</nav>
					)}

					{/* Location Info Bar */}
					<LocationInfoBar
						locationName={selectedLocation.displayName}
						coordinates={coordinates}
					/>

					<div
						className="backdrop-blur-md bg-white/40 text-black p-6 overflow-y-auto rounded-3xl w-[calc(100vw-6rem)] shadow-xl transition-all duration-300 mt-4"
						style={{
							flexGrow: 1,
						}}>
						{showNewNavBar ? (
							<>
								{activeTab === 'AcquisitionDates' && (
									<NotificationSignupPage />
								)}
								{activeTab === 'SatelliteCalendar' && (
									<ThreeMonthCalendar />
								)}
								{activeTab === 'Date' && <Date />}
								{activeTab === 'GenerateData' && (
									<Download
										lat={coordinates.lat}
										lng={coordinates.lng}
										locationName={
											selectedLocation.displayName
										}
									/>
								)}
							</>
						) : (
							<>
								<Download
									lat={coordinates.lat}
									lng={coordinates.lng}
									locationName={selectedLocation.displayName}
								/>
								<button
									className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md mt-4"
									onClick={() => {
										setShowNewNavBar(true);
										setActiveTab('SatelliteCalendar'); // or any default tab
									}}>
									Access the SR Haven
								</button>
							</>
						)}
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
