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
			<div className="metadata bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
				<h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200">Metadata</h2>
				<div className="space-y-2">
					{Object.entries(metadata).map(([key, value]) => (
						<div
							key={key}
							className="flex justify-between items-center p-2 rounded-lg bg-gray-100 even:bg-gray-50 shadow-sm"
						>
							<span className="font-medium text-gray-700 capitalize">{key}</span>
							<span className="text-gray-600">{value.toString()}</span>
						</div>
					))}
				</div>
			</div>

		);
	};

	const renderImages = (bands, composites) => {
		return (
			<div className="images grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
				{/* Bands */}
				{Object.entries(bands).map(([bandName, bandData], index) => (
					<div key={index} className="image-item bg-white rounded-lg shadow-lg overflow-hidden">
						<div className={`flex items-center justify-center h-12 ${bandColors[bandName] || 'bg-gray-400'} text-white text-lg font-bold`}>
							{bandName}
						</div>
						<img src={bandData.url} alt={`${bandName} image`} className="w-full h-auto object-cover" />
						<div className="p-4">
							<p className="text-gray-700">
								<span className="font-semibold">Average: </span>{bandData.average}
							</p>
						</div>
					</div>
				))}

				{/* Composites */}
				{Object.entries(composites).map(([compName, compData], index) => (
					<div key={index} className="image-item bg-white rounded-lg shadow-lg overflow-hidden">
						<div className="flex items-center justify-center h-12 bg-gray-500 text-white text-lg font-bold">
							{compName}
						</div>
						<img src={compData.url} alt={`${compName} composite`} className="w-full h-auto object-cover" />
					</div>
				))}
			</div>

		);
	};

	return (
		<div className="satellite-data-display h-full">
			{/* Tabs */}
			<div className="tabs bg-white shadow-sm p-2 rounded-t-lg">
				<ul className="flex border-b">
					{satellites.map((satellite) => (
						<li
							key={satellite}
							className={`mr-2 pb-1 ${selectedSatellite === satellite ? 'border-b-2 border-blue-500' : ''
								}`}
						>
							<button
								className={`px-4 py-2 font-semibold ${selectedSatellite === satellite
									? 'text-blue-600'
									: 'text-gray-500 hover:text-blue-500'
									}`}
								onClick={() => setSelectedSatellite(satellite)}
							>
								{satellite}
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="flex h-full">
				{/* Left Column - Metadata */}
				<div className="w-full md:w-1/3 p-4 bg-gray-50 border-r border-gray-200">
					<div className="sticky top-0">
						<h2 className="text-xl font-semibold mb-4 text-gray-700">Metadata</h2>
						{renderMetadata(data[selectedSatellite].metadata)}
					</div>
				</div>

				{/* Right Column - Images */}
				<div className="w-full md:w-2/3 p-4 flex flex-col bg-white">
					<div className="flex-1 overflow-y-auto">
						<h2 className="text-xl font-semibold mb-4 text-gray-700">Images</h2>
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
