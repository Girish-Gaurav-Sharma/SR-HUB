import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaCalendarAlt, FaCloud, FaEye } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import Dataa from './Date';

const SatelliteImageGallery = ({ data }) => {
	// State for satellite data
	const [filteredData, setFilteredData] = useState([]);
	const [cloudCoverRange, setCloudCoverRange] = useState([0, 100]);
	const [sortOption, setSortOption] = useState({
		field: 'date',
		order: 'desc',
	});
	const [isDataMounted, setIsDataMounted] = useState(false);
	const [loading, setLoading] = useState(true);
	const [selectedSatellites, setSelectedSatellites] = useState([]);
	const [popupMessage, setPopupMessage] = useState(null);
	const dataLoadedRef = useRef(false);
	const mountDataComponent = () => {
		// You can set a state that conditionally renders <Data />
		setIsDataMounted(true);
	};
	// Check if data is loaded and initialize selectedSatellites
	useEffect(() => {
		if (data && data.length > 0 && !dataLoadedRef.current) {
			setLoading(false);
			setSelectedSatellites([
				...new Set(data.map(item => item.satellite_name)),
			]);
			dataLoadedRef.current = true;
		}
	}, [data]);

	// Update filtered data whenever filters or sorting change
	useEffect(() => {
		let filtered = data.filter(
			item =>
				selectedSatellites.includes(item.satellite_name) &&
				item.cloudcover >= cloudCoverRange[0] &&
				item.cloudcover <= cloudCoverRange[1]
		);

		// Sort data
		if (sortOption.field === 'date') {
			filtered.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return sortOption.order === 'asc'
					? dateA - dateB
					: dateB - dateA;
			});
		} else if (sortOption.field === 'cloudcover') {
			filtered.sort((a, b) => {
				return sortOption.order === 'asc'
					? a.cloudcover - b.cloudcover
					: b.cloudcover - a.cloudcover;
			});
		}

		setFilteredData(filtered);
	}, [selectedSatellites, cloudCoverRange, sortOption, data]);

	// Handlers for filters and sorting options
	const handleSatelliteChange = satelliteName => {
		if (selectedSatellites.includes(satelliteName)) {
			setSelectedSatellites(
				selectedSatellites.filter(name => name !== satelliteName)
			);
		} else {
			setSelectedSatellites([...selectedSatellites, satelliteName]);
		}
	};

	const handleCloudCoverChange = event => {
		const value = parseInt(event.target.value);
		setCloudCoverRange([0, value]);
	};

	const handleSortFieldChange = event => {
		setSortOption({ ...sortOption, field: event.target.value });
	};

	const handleSortOrderChange = event => {
		setSortOption({ ...sortOption, order: event.target.value });
	};

	// Show popup when a card is clicked
	const showPopup = () => {
		setPopupMessage('No data available');
	};

	const closePopup = () => {
		setPopupMessage(null);
	};

	const satelliteColors = {
		'Sentinel-2A': 'bg-blue-400',
		'Sentinel-2B': 'bg-green-400',
		'Landsat 8': 'bg-red-400',
		'Landsat 9': 'bg-orange-400',
		HLS: 'bg-yellow-400',
		// Add more if necessary
	};

	// Render loading, error, or content
	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center flex flex-col items-center justify-center">
					<div className="loader-spinner rounded-full border-t-4 border-b-4 border-blue-500 w-16 h-16 animate-spin"></div>
					<p className="mt-4 text-2xl font-semibold">
						Loading Satellite Images...
					</p>
					<p className="mt-2 text-lg text-gray-700">
						It usually takes around 5 minutes.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="satellite-image-gallery h-full">
			<div className="flex flex-col md:flex-row h-full">
				{/* Left Column */}
				<div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
					<div className="md:sticky md:top-0">
						{/* Sorting options */}
						<div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
							<h2 className="text-2xl font-semibold mb-6 text-gray-800">
								Sort Options
							</h2>
							<div className="space-y-4">
								<div className="flex items-center bg-gray-50 p-4 rounded-lg">
									<div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md mr-4">
										<FaCalendarAlt className="text-green-500" />
									</div>
									<div className="flex-1">
										<label className="text-gray-600 text-sm font-semibold">
											Sort by
										</label>
										<select
											value={sortOption.field}
											onChange={handleSortFieldChange}
											className="border rounded p-1 w-full mt-1">
											<option value="date">Date</option>
											<option value="cloudcover">
												Cloud Cover
											</option>
										</select>
									</div>
								</div>
								<div className="flex items-center bg-gray-50 p-4 rounded-lg">
									<div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md mr-4">
										<FaArrowUp className="text-blue-500" />
									</div>
									<div className="flex-1">
										<label className="text-gray-600 text-sm font-semibold">
											Order
										</label>
										<select
											value={sortOption.order}
											onChange={handleSortOrderChange}
											className="border rounded p-1 w-full mt-1">
											<option value="asc">
												Ascending
											</option>
											<option value="desc">
												Descending
											</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						{/* Filters */}
						<div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
							<h2 className="text-2xl font-semibold mb-6 text-gray-800">
								Satellite Name
							</h2>
							<div className="space-y-2">
								{[
									...new Set(
										data.map(item => item.satellite_name)
									),
								].map(name => (
									<div
										key={name}
										className="flex items-center bg-gray-50 p-2 rounded-lg">
										<input
											type="checkbox"
											className="form-checkbox h-5 w-5 text-blue-600"
											checked={selectedSatellites.includes(
												name
											)}
											onChange={() =>
												handleSatelliteChange(name)
											}
										/>
										<span className="ml-2 text-gray-800">
											{name}
										</span>
									</div>
								))}
							</div>
						</div>
						{/* Cloud cover slider */}
						<div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
							<h2 className="text-2xl font-semibold mb-6 text-gray-800">
								Cloud Cover ({cloudCoverRange[0]}% -{' '}
								{cloudCoverRange[1]}%)
							</h2>
							<div className="flex items-center bg-gray-50 p-4 rounded-lg">
								<div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md mr-4">
									<FaCloud className="text-gray-500" />
								</div>
								<input
									type="range"
									min="0"
									max="100"
									value={cloudCoverRange[1]}
									onChange={handleCloudCoverChange}
									className="w-full"
								/>
							</div>
						</div>
					</div>
				</div>
				{/* Right Column */}
				<div className="w-full md:w-2/3 md:pl-4 flex flex-col">
					{/* Images */}
					<div className="flex-1 h-auto p-4">
						<div className="images grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredData.map((item, index) => (
								<motion.div
									key={index}
									className="image-item bg-white p-4 rounded-lg shadow-lg cursor-pointer"
									whileHover={{ scale: 1.05 }}
									onClick={showPopup}>
									<div
										className={`flex items-center justify-center ${
											satelliteColors[
												item.satellite_name
											] || 'bg-gray-400'
										} rounded-full px-4 py-2 mb-2`}>
										<h3 className="text-lg font-semibold text-black">
											{item.satellite_name}
										</h3>
									</div>
									{item.real_image_url ? (
										<img
											src={item.real_image_url}
											alt={`Scene ${item.systemId}`}
											className="w-full h-auto mb-2 rounded"
										/>
									) : (
										<div className="w-full h-48 flex items-center justify-center bg-gray-200 mb-2 rounded">
											<p>Error loading image</p>
										</div>
									)}
									{/* Details */}
									<div className="space-y-2">
										<div className="flex items-start bg-gray-50 p-2 rounded-lg">
											<div className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md mr-2">
												<FaCalendarAlt className="text-green-500" />
											</div>
											<div className="flex-1">
												<p className="text-gray-600 text-sm">
													Date
												</p>
												<p className="text-gray-800 font-medium">
													{item.date}
												</p>
											</div>
										</div>
										<div className="flex items-start bg-gray-50 p-2 rounded-lg">
											<div className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md mr-2">
												<FaCloud className="text-gray-500" />
											</div>
											<div className="flex-1">
												<p className="text-gray-600 text-sm">
													Cloud Cover
												</p>
												<p className="text-gray-800 font-medium">
													{item.cloudcover}%
												</p>
											</div>
										</div>
										<div className="flex items-start bg-gray-50 p-2 rounded-lg">
											<div className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md mr-2">
												<FaEye className="text-purple-500" />
											</div>
											<div className="flex-1 break-words break-all">
												<p className="text-gray-600 text-sm">
													Scene ID
												</p>
												<p className="text-gray-800 font-medium">
													{item.systemId}
												</p>
											</div>
										</div>
									</div>
								</motion.div>
							))}
							{filteredData.length === 0 && (
								<p>No images match the selected filters.</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Popup Message */}
			{popupMessage &&
				ReactDOM.createPortal(
					<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
						<div className="bg-white max-w-lg w-full mx-4 md:mx-auto p-8 rounded-lg shadow-2xl text-center relative">
							<button
								onClick={closePopup}
								className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
							<div className="flex flex-col items-center">
								<p className="text-2xl font-semibold text-gray-900">
									It may take 5 minutes to generate the
									complete SR profile of the scene.
								</p>
								<button
									onClick={() => {
										closePopup(); // Close the popup first
										mountDataComponent(); // Call the function to mount <Data />
									}}
									className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
									Generate Complete SR Profile
								</button>
							</div>
						</div>
					</div>,
					document.body
				)}
			{isDataMounted &&
				ReactDOM.createPortal(
					<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
						{/* Sticky Close Button */}
						<button
							className="fixed top-1 right-4 text-white bg-red-600 w-20 rounded-full p-3 hover:bg-red-700 text-lg font-semibold z-50"
							onClick={() => setIsDataMounted(false)} // Ensure `setIsDataMounted` is a function to toggle mounting
						>
							✕
						</button>
						<div
							className="
                    backdrop-blur-md bg-white/40 text-black p-6 overflow-y-auto rounded-3xl
                    w-[calc(100vw-2rem)] max-[799px]:w-[95vw] max-[799px]:h-[95vh] h-[calc(100vh-2rem)]
                    shadow-2xl transition-all duration-300 mt-10 relative
                "
							style={{ flexGrow: 1 }}>
							<Dataa />
						</div>
					</div>,
					document.body
				)}
		</div>
	);
};

export default SatelliteImageGallery;
