import React, { useState } from 'react';

const Dataa = () => {
	const data = {
		'Landsat 8': {
			metadata: {
				coordinates: [80.249, 13.082],
				imageBufferSize: 5000,
				avgBufferSize: 100,
				startDate: '2021-01-01',
				endDate: '2021-12-31',
				CLOUD_COVERAGE: 3,
				SPATIAL_COVERAGE: 100,
				MEAN_SUN_AZIMUTH_ANGLE: 146.28710403,
				MEAN_SUN_ZENITH_ANGLE: 43.75211919,
				MEAN_VIEW_AZIMUTH_ANGLE: 221.97509045,
				MEAN_VIEW_ZENITH_ANGLE: 2.9762861,
			},
			bands: {
				B2: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.06317611104764083,
				},
				B3: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.0957873757568834,
				},
				B4: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.10223739289386496,
				},
				B5: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.20293394264823492,
				},
				B6: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.19586324688678175,
				},
				B7: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.14944526448074952,
				},
				NDVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.3362116660830717,
				},
				NDWI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: -0.3602293033064506,
				},
				EVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.18869075070967348,
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
		},
		'Landsat 9': {
			metadata: {
				coordinates: [80.249, 13.082],
				imageBufferSize: 5000,
				avgBufferSize: 100,
				startDate: '2021-01-01',
				endDate: '2021-12-31',
				CLOUD_COVERAGE: 3,
				SPATIAL_COVERAGE: 100,
				MEAN_SUN_AZIMUTH_ANGLE: 146.28710403,
				MEAN_SUN_ZENITH_ANGLE: 43.75211919,
				MEAN_VIEW_AZIMUTH_ANGLE: 221.97509045,
				MEAN_VIEW_ZENITH_ANGLE: 2.9762861,
			},
			bands: {
				B2: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.06317611104764083,
				},
				B3: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.0957873757568834,
				},
				B4: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.10223739289386496,
				},
				B5: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.20293394264823492,
				},
				B6: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.19586324688678175,
				},
				B7: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.14944526448074952,
				},
				NDVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.3362116660830717,
				},
				NDWI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: -0.3602293033064506,
				},
				EVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.18869075070967348,
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
		},
		'Sentinel 2A': {
			metadata: {
				coordinates: [80.249, 13.082],
				imageBufferSize: 5000,
				avgBufferSize: 100,
				startDate: '2021-01-01',
				endDate: '2021-12-31',
				CLOUD_COVERAGE: 3,
				SPATIAL_COVERAGE: 100,
				MEAN_SUN_AZIMUTH_ANGLE: 146.28710403,
				MEAN_SUN_ZENITH_ANGLE: 43.75211919,
				MEAN_VIEW_AZIMUTH_ANGLE: 221.97509045,
				MEAN_VIEW_ZENITH_ANGLE: 2.9762861,
			},
			bands: {
				B2: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.06317611104764083,
				},
				B3: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.0957873757568834,
				},
				B4: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.10223739289386496,
				},
				B5: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.20293394264823492,
				},
				B6: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.19586324688678175,
				},
				B7: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.14944526448074952,
				},
				NDVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.3362116660830717,
				},
				NDWI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: -0.3602293033064506,
				},
				EVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.18869075070967348,
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
		},
		'Sentinel 2B': {
			metadata: {
				coordinates: [80.249, 13.082],
				imageBufferSize: 5000,
				avgBufferSize: 100,
				startDate: '2021-01-01',
				endDate: '2021-12-31',
				CLOUD_COVERAGE: 3,
				SPATIAL_COVERAGE: 100,
				MEAN_SUN_AZIMUTH_ANGLE: 146.28710403,
				MEAN_SUN_ZENITH_ANGLE: 43.75211919,
				MEAN_VIEW_AZIMUTH_ANGLE: 221.97509045,
				MEAN_VIEW_ZENITH_ANGLE: 2.9762861,
			},
			bands: {
				B2: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.06317611104764083,
				},
				B3: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.0957873757568834,
				},
				B4: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.10223739289386496,
				},
				B5: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.20293394264823492,
				},
				B6: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.19586324688678175,
				},
				B7: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.14944526448074952,
				},
				NDVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.3362116660830717,
				},
				NDWI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: -0.3602293033064506,
				},
				EVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.18869075070967348,
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
		},
		HLS: {
			metadata: {
				coordinates: [80.249, 13.082],
				imageBufferSize: 5000,
				avgBufferSize: 100,
				startDate: '2021-01-01',
				endDate: '2021-12-31',
				CLOUD_COVERAGE: 3,
				SPATIAL_COVERAGE: 100,
				MEAN_SUN_AZIMUTH_ANGLE: 146.28710403,
				MEAN_SUN_ZENITH_ANGLE: 43.75211919,
				MEAN_VIEW_AZIMUTH_ANGLE: 221.97509045,
				MEAN_VIEW_ZENITH_ANGLE: 2.9762861,
			},
			bands: {
				B2: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.06317611104764083,
				},
				B3: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.0957873757568834,
				},
				B4: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.10223739289386496,
				},
				B5: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.20293394264823492,
				},
				B6: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.19586324688678175,
				},
				B7: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.14944526448074952,
				},
				NDVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.3362116660830717,
				},
				NDWI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: -0.3602293033064506,
				},
				EVI: {
					url: 'https://custom-scripts.sentinel-hub.com/custom-scripts/hls/true_color/fig/fig1.jpeg',
					average: 0.18869075070967348,
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
		},
	};

	const satellites = Object.keys(data);
	const [selectedSatellite, setSelectedSatellite] = useState(satellites[0]);

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

	const renderMetadata = metadata => {
		return (
			<div className="metadata bg-white p-4 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Metadata</h2>
				<ul className="list-disc pl-6">
					{Object.entries(metadata).map(([key, value]) => (
						<li
							key={key}
							className="mb-1">
							<span className="font-semibold">{key}: </span>
							{value.toString()}
						</li>
					))}
				</ul>
			</div>
		);
	};

	const renderImages = (bands, composites) => {
		return (
			<div className="images grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Bands */}
				{Object.entries(bands).map(([bandName, bandData], index) => (
					<div
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
					</div>
				))}
				{/* Composites */}
				{Object.entries(composites).map(
					([compName, compData], index) => (
						<div
							key={index}
							className="image-item bg-white p-4 rounded-lg shadow-lg">
							<div className="flex items-center justify-center w-full bg-gray-400 rounded-full p-4 mb-2">
								<h3 className="text-xl font-semibold text-black">
									{compName}
								</h3>
							</div>
							<img
								src={compData.url}
								alt={`${compName} composite`}
								className="w-full h-auto rounded"
							/>
						</div>
					)
				)}
			</div>
		);
	};

	return (
		<div className="satellite-data-display h-full">
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
				{/* Left Column - Metadata */}
				<div className="w-1/3 pr-4">
					<div className="sticky top-0">
						{renderMetadata(data[selectedSatellite].metadata)}
					</div>
				</div>
				{/* Right Column - Images */}
				<div className="w-2/3 pl-4 flex flex-col">
					<div className="flex-1 min-h-0 overflow-y-auto">
						{renderImages(
							data[selectedSatellite].bands,
							data[selectedSatellite].composites
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dataa;
