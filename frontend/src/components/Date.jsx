import React from 'react';
import {
	FaMapMarkerAlt,
	FaCalendarAlt,
	FaCloud,
	FaSun,
	FaEye,
} from 'react-icons/fa';

const Dataa = () => {
	const data = {
		metadata: {
			coordinates: [80.249, 13.082],
			imageBufferSize: 5000,
			avgBufferSize: 100,
			startDate: '2021-01-01',
			endDate: '2021-12-31',
			CLOUD_COVERAGE: 3,
			SPATIAL_COVERAGE: 100,
			MEAN_SUN_AZIMUTH_ANGLE: 146.29,
			MEAN_SUN_ZENITH_ANGLE: 43.75,
			MEAN_VIEW_AZIMUTH_ANGLE: 221.98,
			MEAN_VIEW_ZENITH_ANGLE: 2.98,
		},
		bands: {
			B2: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: 0.06,
			},
			B3: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: 0.1,
			},
			B4: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: 0.1,
			},
			B5: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: 0.2,
			},
			B6: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: 0.2,
			},
			B7: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: 0.15,
			},
			NDVI: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: 0.34,
			},
			NDWI: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: -0.36,
			},
			EVI: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
				average: 0.19,
			},
		},
		composites: {
			RGB: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
			},
			False_Color: {
				url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
			},
		},
	};

	const bandColors = {
		B2: 'bg-blue-400',
		B3: 'bg-green-400',
		B4: 'bg-red-400',
		B5: 'bg-orange-400',
		B6: 'bg-yellow-400',
		B7: 'bg-purple-400',
		NDVI: 'bg-teal-400',
		NDWI: 'bg-indigo-400',
		EVI: 'bg-pink-400',
	};

	const formatKeyName = key =>
		key
			.replace(/_/g, ' ')
			.replace(/([A-Z])/g, ' $1')
			.replace(/\s+/g, ' ')
			.toLowerCase()
			.trim()
			.replace(/\b\w/g, str => str.toUpperCase());

	const renderMetadata = metadata => {
		const items = [
			{
				icon: <FaMapMarkerAlt className="text-blue-500" />,
				label: 'Coordinates',
				value: `Longitude: ${metadata.coordinates[0]}, Latitude: ${metadata.coordinates[1]}`,
			},
			{
				icon: <FaCalendarAlt className="text-green-500" />,
				label: 'Date Range',
				value: `${new Date(
					metadata.startDate
				).toLocaleDateString()} - ${new Date(
					metadata.endDate
				).toLocaleDateString()}`,
			},
			{
				icon: <FaCloud className="text-gray-500" />,
				label: 'Cloud Coverage',
				value: `${metadata.CLOUD_COVERAGE}%`,
			},
			{
				icon: <FaSun className="text-yellow-500" />,
				label: 'Mean Sun Azimuth Angle',
				value: `${metadata.MEAN_SUN_AZIMUTH_ANGLE.toFixed(2)}°`,
			},
			{
				icon: <FaSun className="text-orange-500" />,
				label: 'Mean Sun Zenith Angle',
				value: `${metadata.MEAN_SUN_ZENITH_ANGLE.toFixed(2)}°`,
			},
			{
				icon: <FaEye className="text-purple-500" />,
				label: 'Mean View Azimuth Angle',
				value: `${metadata.MEAN_VIEW_AZIMUTH_ANGLE.toFixed(2)}°`,
			},
			{
				icon: <FaEye className="text-pink-500" />,
				label: 'Mean View Zenith Angle',
				value: `${metadata.MEAN_VIEW_ZENITH_ANGLE.toFixed(2)}°`,
			},
			{
				icon: <FaCloud className="text-indigo-500" />,
				label: 'Spatial Coverage',
				value: `${metadata.SPATIAL_COVERAGE}%`,
			},
		];

		return (
			<div className="metadata bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-6 text-gray-800">
					Metadata
				</h2>
				<div className="space-y-4">
					{items.map((item, index) => (
						<div
							key={index}
							className="flex items-center bg-gray-50 p-4 rounded-lg">
							<div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md mr-4">
								{item.icon}
							</div>
							<div>
								<p className="text-gray-600 text-sm">
									{item.label}
								</p>
								<p className="text-gray-800 font-medium">
									{item.value}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderImages = (bands, composites) => (
		<div className="images grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{/* Bands */}
			{Object.entries(bands).map(([bandName, bandData], index) => (
				<div
					key={index}
					className="image-item bg-white p-4 rounded-lg shadow-lg">
					<div
<<<<<<< HEAD
						key={index}
						className="image-item bg-white p-4 rounded-lg shadow-lg">
						<div
							className={`flex items-center justify-center w-full ${bandColors[bandName] || 'bg-gray-400'
								} rounded-full p-4 mb-2`}>
							<h3 className="text-xl font-semibold text-black">
								{bandName}
							</h3>
						</div>
						<img
							src={bandData.url}
							alt={`${bandName} image`}
							className="w-full h-auto mb-2 rounded"
						/>
						<p>
							<span className="font-semibold">Average: </span>
							{bandData.average}
						</p>
=======
						className={`flex items-center justify-center ${
							bandColors[bandName] || 'bg-gray-400'
						} rounded-full px-4 py-2 mb-2`}>
						<h3 className="text-lg font-semibold text-black">
							{bandName}
						</h3>
>>>>>>> refs/remotes/origin/master
					</div>
					<img
						src={bandData.url}
						alt={`${bandName} image`}
						className="w-full h-auto mb-2 rounded"
					/>
					<p>
						<span className="font-semibold">Average: </span>
						{bandData.average.toFixed(2)}
					</p>
				</div>
			))}
			{/* Composites */}
			{Object.entries(composites).map(([compName, compData], index) => (
				<div
					key={index}
					className="image-item bg-white p-4 rounded-lg shadow-lg">
					<div className="flex items-center justify-center bg-gray-400 rounded-full px-4 py-2 mb-2">
						<h3 className="text-lg font-semibold text-black">
							{formatKeyName(compName)}
						</h3>
					</div>
					<img
						src={compData.url}
						alt={`${compName} composite`}
						className="w-full h-auto rounded"
					/>
				</div>
			))}
		</div>
	);

	return (
		<div className="satellite-data-display h-full">
<<<<<<< HEAD
			<div className="tabs">
				<ul className="flex border-b">
					{satellites.map(satellite => (
						<li
							key={satellite}
							className={`mr-1 ${selectedSatellite === satellite
								? 'border-blue-500'
								: ''
								}`}>
							<button
								className={`bg-white inline-block py-2 px-4 font-semibold ${selectedSatellite === satellite
									? 'text-blue-700'
									: 'text-blue-500 hover:text-blue-800'
									}`}
								onClick={() => setSelectedSatellite(satellite)}>
								{satellite}
							</button>
						</li>
					))}
				</ul>
			</div>
			<div className="flex h-full">
=======
			<div className="flex flex-col md:flex-row h-full">
>>>>>>> refs/remotes/origin/master
				{/* Left Column - Metadata */}
				<div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
					<div className="md:sticky md:top-0">
						{renderMetadata(data.metadata)}
					</div>
				</div>
				{/* Right Column - Images */}
				<div className="w-full md:w-2/3 md:pl-4 flex flex-col">
					<div className="flex-1 h-auto">
						{renderImages(data.bands, data.composites)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dataa;
