import React, { useState, useRef, useCallback, useEffect } from 'react';
import Map from './components/Map';
import Search from './components/Search';
import CoordinateInput from './components/CoordinateInput';
import axios from 'axios';
import 'antd/dist/reset.css';
import Download from './components/download';
import ThreeMonthCalendar from './components/Calanderview';
import Dataa from './components/Date';
import NotificationSignupPage from './components/Form';
import Tutorial from './components/Tutorial';
import SatelliteImageGallery from './components/databasmonth';
//-------------------------------------------------------------------------------------
const App = () => {
	const [showGallery, setShowGallery] = useState(false);
	const [generateDataButtonClicked, setGenerateDataButtonClicked] =
		useState(false);
	const [isUserTyping, setIsUserTyping] = useState(false);
	const [showOlderNavBar, setShowOlderNavBar] = useState(true);
	const [showCanvas, setShowCanvas] = useState(false);
	const [activeTab, setActiveTab] = useState('AcquisitionDates');
	const [showNewNavBar, setShowNewNavBar] = useState(false);
	const [calendarData, setCalendarData] = useState([]);
	const [showTutorial, setShowTutorial] = useState(true);
	const startDateValue = new Date().toISOString().split('T')[0];
	const endDateValue = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
		.toISOString()
		.split('T')[0];
	const [endDate, setStartDateValue] = useState(startDateValue);
	const [startDate, setEndDateValue] = useState(endDateValue);

	const [center, setCenter] = useState([53.504, -0.0669]);
	const [zoom, setZoom] = useState(8);
	const [dates, setdates] = useState([]);
	const [wantData, setWantData] = useState(false);
	const [coordinates, setCoordinates] = useState({
		lat: '53.5040',
		lng: '-0.0669',
	});
	const [satelliteSelections, setSatelliteSelections] = useState([]);

	const handleSatelliteSelection = event => {
		const { value, checked } = event.target;
		setSatelliteSelections(prevSelections =>
			checked
				? [...prevSelections, value]
				: prevSelections.filter(item => item !== value)
		);
	};
	const [cloudCover, setCloudCover] = useState(50); // Default 50%
	const [dimension, setDimension] = useState(1000); // Default 1000 meters
	const [data, setData] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState({
		coordinates: [53.504, -0.0669],
		displayName:
			'Cheapside, Cheapside Farm, Waltham, North East Lincolnshire, England, DN37 0FJ, United Kingdom',
	});
	const [selectedSatellites, setSelectedSatellites] = useState([]);
	const [searchQuery, setSearchQuery] = useState(
		'Cheapside, Cheapside Farm, Waltham, North East Lincolnshire, England, DN37 0FJ, United Kingdom'
	);
	// const API_URL = 'http://localhost:5000';
	const API_URL = 'https://sr-hub-backend.onrender.com';
	const mapRef = useRef();

	//-------------------------------------------------------------------------------------

	const fetchAcquisitionDates = async () => {
		console.log('Fetching acquisition dates...');

		try {
			const response = await axios.get(
				`${API_URL}/get-acquisition-dates?longitude=${coordinates.lng}&latitude=${coordinates.lat}`
			);
			console.log('Response received:', response);
			if (response.status === 200) {
				setdates(response.data);
			} else {
				console.log(`Unexpected response code: ${response.status}`);
			}
		} catch (error) {
			console.error('Error during fetch:', error);
		} finally {
			console.log('Finished fetching acquisition dates.'); // Stop loading regardless of the outcome
		}
	};
	//-------------------------------------------------------------------------------------

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`${API_URL}/get-full-metadata?longitude=${coordinates.lng}&latitude=${coordinates.lat}&startDate=${startDate}&endDate=${endDate}`
			);
			const fetchedData = response.data;

			setData(fetchedData);

			const satelliteNames = [
				...new Set(fetchedData.map(item => item.satellite_name)),
			];
			setSelectedSatellites(satelliteNames);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	//-------------------------------------------------------------------------------------

	const handleCoordinatesChange = useCallback(() => {
		if (mapRef.current) {
			mapRef.current.flyTo([coordinates.lat, coordinates.lng], 8, {
				animate: true,
			});
		}
	}, [coordinates, mapRef]);
	//-------------------------------------------------------------------------------------

	const handleUserTyping = useCallback(isTyping => {
		setIsUserTyping(isTyping);
	}, []);
	//-------------------------------------------------------------------------------------
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
	//-------------------------------------------------------------------------------------
	const handleZoomChange = newZoom => {
		setZoom(newZoom);
	};
	//-------------------------------------------------------------------------------------

	const LocationInfoBar = ({ locationName, coordinates }) => {
		const [name, ...rest] = locationName.split(',');
		const address = [name, ...rest].join(',').slice(0, 30);
		const lat = parseFloat(coordinates.lat).toFixed(4);
		const lng = parseFloat(coordinates.lng).toFixed(4);
		return (
			<div
				className="backdrop-blur-md bg-white/40 text-black flex items-center justify-center p-2 h-12 shadow-lg rounded-full mx-6 mt-4"
				style={{ width: 'calc(100% - 3rem)' }}>
				<p className="text-lg font-semibold">
					You have locked your location to{' '}
					<span className="bg-yellow-200 p-1 rounded-md">
						{address}
					</span>{' '}
					(<span className="bg-yellow-200 p-1 rounded-md">{lat}</span>
					,{' '}
					<span className="bg-yellow-200 p-1 rounded-md">{lng}</span>)
				</p>
			</div>
		);
	};
	//-------------------------------------------------------------------------------------
	useEffect(() => {
		handleCoordinatesChange();
	}, [handleCoordinatesChange]);
	//-------------------------------------------------------------------------------------
	return (
		<div className="relative flex flex-col h-screen">
			{showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
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
							setShowNewNavBar(true);
							fetchAcquisitionDates();
							setdates([]);
							setData([]);
							setSelectedSatellites([]);
							setWantData(false);
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

									

									className={`bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 shadow-md ${
										activeTab === 'AcquisitionDates'
											? 'bg-blue-800 border border-blue-950'
											: ''
									}`}

									onClick={() =>
										setActiveTab('AcquisitionDates')
									}>
									Turn On Notifications
								</button>
								<button

								

									className={`bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 shadow-md ${
										activeTab === 'gallery'
											? 'bg-blue-800 border border-blue-950'
											: ''
									}`}

									onClick={() => setActiveTab('gallery')}>
									Request Data
								</button>
								<button

									

									className={`bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 shadow-md ${
										activeTab === 'SatelliteCalendar'
											? 'bg-blue-800 border border-blue-950'
											: ''
									}`}

									onClick={() =>
										setActiveTab('SatelliteCalendar')
									}>
									Satellite Calendar
								</button>
								<button

									className={`bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 shadow-md ${
										activeTab === 'Dataa'
											? 'bg-blue-800 border border-blue-950'
											: ''
									}`}

									onClick={() => setActiveTab('Dataa')}>
									Complete SR Profile
								</button>
							</div>
							<button

								className={`${
									wantData && data.length === 0
										? 'bg-red-600 hover:bg-red-700'
										: 'bg-blue-600 hover:bg-blue-800'
								} text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 shadow-md`}

								onClick={() => {
									setShowOlderNavBar(true);
									setShowCanvas(false);
								}}
								disabled={wantData && data.length === 0}>
								{wantData && data.length === 0
									? 'Wait till Data is received'
									: 'Change Location'}
							</button>
						</nav>
					)}

					{/* Location Info Bar */}
					<LocationInfoBar
						locationName={searchQuery}
						coordinates={coordinates}
					/>

					<div
						className="
    backdrop-blur-md
    bg-white/40
    text-black
    p-6
    overflow-y-auto
    rounded-3xl
    w-[calc(100vw-6rem)]
    max-[799px]:w-full
    shadow-xl
    transition-all
    duration-300
    mt-4
  "
						style={{ flexGrow: 1 }}>
						{showNewNavBar && (
							<>
								{activeTab === 'AcquisitionDates' && (
									<NotificationSignupPage
										longitude={coordinates.lng}
										latitude={coordinates.lat}
										name={searchQuery}
									/>
								)}
								{activeTab === 'SatelliteCalendar' && (
									<ThreeMonthCalendar dates={dates} />
								)}
								{activeTab === 'Dataa' && <Dataa />}
								{activeTab === 'gallery' && (
									<>
										<div className="relative">
											{/* Full screen overlay */}
											{!wantData && (
												<div className="inset-0 flex items-center justify-center bg-transparent z-50">
													<div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-lg space-y-6">
														<h2 className="text-2xl font-semibold text-gray-800 text-center">
															Configure Your Data
															Selection
														</h2>

														{/* Database Selection */}
														<div className="space-y-4 border-t border-b py-4 px-2">
															<h3 className="text-lg font-medium text-gray-700">
																Select Databases
															</h3>
															<div className="grid grid-cols-2 gap-3">
																{[
																	'Landsat 8',
																	'Landsat 9',
																	'Sentinel-2A',
																	'Sentinel-2B',
																	'HLS',
																].map(
																	satellite => (
																		<label
																			key={
																				satellite
																			}
																			className="flex items-center space-x-2 text-gray-700">
																			<input
																				type="checkbox"
																				value={
																					satellite
																				}
																				onChange={
																					handleSatelliteSelection
																				}
																				className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
																			/>
																			<span className="text-sm font-medium">
																				{
																					satellite
																				}
																			</span>
																		</label>
																	)
																)}
															</div>
														</div>

														{/* Cloud Cover Slider */}
														<div className="space-y-2">
															<h3 className="text-lg font-medium text-gray-700 text-center">
																Maximum Cloud
																Cover (%)
															</h3>
															<input
																type="range"
																min="0"
																max="100"
																value={
																	cloudCover
																}
																onChange={e =>
																	setCloudCover(
																		e.target
																			.value
																	)
																}
																className="appearance-none w-full h-3 bg-gray-300 rounded-full focus:outline-none"
															/>
															<span className="block text-center text-sm text-gray-600">
																{cloudCover}%
															</span>
														</div>

														{/* Data Dimension Slider */}
														<div className="space-y-2">
															<h3 className="text-lg font-medium text-gray-700 text-center">
																Data Dimension
																(meters)
															</h3>
															<input
																type="range"
																min="500"
																max="5000"
																step="100"
																value={
																	dimension
																}
																onChange={e =>
																	setDimension(
																		e.target
																			.value
																	)
																}
																className="appearance-none w-full h-3 bg-gray-300 rounded-full focus:outline-none"
															/>
															<span className="block text-center text-sm text-gray-600">
																{dimension}{' '}
																meters
															</span>
														</div>

														{/* Warning Message */}
														<p className="text-center text-sm text-red-600">
															Generating data may
															take up to 5
															minutes. Location
															changes are disabled
															during this process.
														</p>

														{/* Generate Data Button */}
														<button
															className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full shadow-md transition duration-300"
															onClick={() => {
																setWantData(
																	true
																);
																setGenerateDataButtonClicked(
																	true
																);
																setShowGallery(
																	true
																);
															}}
															disabled={
																generateDataButtonClicked
															}>
															Generate Data
														</button>
													</div>
												</div>
											)}
										</div>

										{/* Conditionally render SatelliteImageGallery */}
										{showGallery && (
											<SatelliteImageGallery
												data={data}
												selectedSatellites={
													selectedSatellites
												}
											/>
										)}
									</>
								)}
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
