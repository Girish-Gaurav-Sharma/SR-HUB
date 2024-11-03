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
			coordinates: [-122.292, 37.901],
			imageBufferSize: 10000,
			avgBufferSize: 100,
			DATE_ACQUIRED: '2021-12-26',
			LANDSAT_SCENE_ID: 'LC90440342021360LGN02',
			LANDSAT_PRODUCT_ID: 'LC09_L2SP_044034_20211226_20230503_02_T1',
			CLOUD_COVER: 69.48,
			SUN_AZIMUTH: 158.78045423,
			SUN_ELEVATION: 26.13745452,
			EARTH_SUN_DISTANCE: 0.9834718,
			GEOMETRIC_RMSE_MODEL: 8.399,
			GEOMETRIC_RMSE_MODEL_X: 5.288,
			GEOMETRIC_RMSE_MODEL_Y: 6.525,
		},
		bands: {
			SR_B2: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/097aec21db3323c5a3ebc1512a81dd1c-d2de2542f48feef022a3e0bfdea4d4a6:getPixels',
				average: 0.09715862110175277,
			},
			SR_B3: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/d0c738a8a32ec4d3ccebd1802acd5a23-5692abe654f709563bf90f151c67cefa:getPixels',
				average: 0.1445113487366264,
			},
			SR_B4: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/e657b5e60a7e113e21b55493f98b6037-094aae04a3732df41f34db8f1e0d212d:getPixels',
				average: 0.1510424547575688,
			},
			SR_B5: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/557b4e04edf64c71bcfbd83712ff4780-1e4da908e6c032dd0764f877aff55021:getPixels',
				average: 0.2617978565331207,
			},
			SR_B6: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/4da5529f0a988c15d73ab8961df2d301-789d46a18c560002fa006b304d94b6ca:getPixels',
				average: 0.24065613760528104,
			},
			SR_B7: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/8c474d3e5aa0467efb3b76eb9dee426a-77bce9e695aa92608a0edd5ca62f2869:getPixels',
				average: 0.23094760471204184,
			},
			ST_B10: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/00f3b7d9e3544a006f269341fec61f8d-f5ffc2abe9269452599a862fd4a21d7c:getPixels',
				average: 256.8173560821079,
			},
			NDVI: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/4f70048c6f427dde26efb4d0fc0af833-945667819242e1562be7d1d7e51110d0:getPixels',
				average: 0.27197987198898294,
			},
			NDWI: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/9f33deaf3e291c2c33fa36686548099f-ddbe91bcd55f5cb630a2129c2ea27942:getPixels',
				average: -0.29255266248159173,
			},
			EVI: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/2cf37b5708167c1ed88a4a6e5595ebe5-31904fc9a652e2b1938e6181b7f45e4e:getPixels',
				average: 0.19483414004532806,
			},
		},
		composites: {
			RGB: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/a9379b341212d75194bf02878c2cdc93-59c3d865543397e4bf843acd69a659f6:getPixels',
			},
			False_Color: {
				url: 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/thumbnails/fdc7f247b773444d7ad16f9f1021c3fe-920109b3c9a0b8fb4484faa7fbb10836:getPixels',
			},
		},
	};

	const bandColors = {
		SR_B2: 'bg-blue-400',
		SR_B3: 'bg-green-400',
		SR_B4: 'bg-red-400',
		SR_B5: 'bg-orange-400',
		SR_B6: 'bg-yellow-400',
		SR_B7: 'bg-purple-400',
		ST_B10: 'bg-teal-400',
		NDVI: 'bg-indigo-400',
		NDWI: 'bg-pink-400',
		EVI: 'bg-gray-400',
	};

	const renderMetadata = metadata => {
		const items = [
			{
				icon: <FaMapMarkerAlt className="text-blue-500" />,
				label: 'Coordinates',
				value: `Longitude: ${metadata.coordinates[0]}, Latitude: ${metadata.coordinates[1]}`,
			},
			{
				icon: <FaCalendarAlt className="text-green-500" />,
				label: 'Date Acquired',
				value: metadata.DATE_ACQUIRED,
			},
			{
				icon: <FaCloud className="text-gray-500" />,
				label: 'Cloud Cover',
				value: `${metadata.CLOUD_COVER}%`,
			},
			{
				icon: <FaSun className="text-yellow-500" />,
				label: 'Sun Azimuth',
				value: `${metadata.SUN_AZIMUTH.toFixed(2)}°`,
			},
			{
				icon: <FaSun className="text-orange-500" />,
				label: 'Sun Elevation',
				value: `${metadata.SUN_ELEVATION.toFixed(2)}°`,
			},
			{
				icon: <FaEye className="text-purple-500" />,
				label: 'Earth-Sun Distance',
				value: metadata.EARTH_SUN_DISTANCE.toFixed(6),
			},
			{
				icon: <FaEye className="text-pink-500" />,
				label: 'Geometric RMSE Model',
				value: metadata.GEOMETRIC_RMSE_MODEL.toFixed(2),
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
			{Object.entries(bands).map(([bandName, bandData], index) => (
				<div
					key={index}
					className="image-item bg-white p-4 rounded-lg shadow-lg">
					<div
						className={`flex items-center justify-center ${
							bandColors[bandName] || 'bg-gray-400'
						} rounded-full px-4 py-2 mb-2`}>
						<h3 className="text-lg font-semibold text-black">
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
						{bandData.average.toFixed(2)}
					</p>
				</div>
			))}
			{Object.entries(composites).map(([compName, compData], index) => (
				<div
					key={index}
					className="image-item bg-white p-4 rounded-lg shadow-lg">
					<div className="flex items-center justify-center bg-gray-400 rounded-full px-4 py-2 mb-2">
						<h3 className="text-lg font-semibold text-black">
							{compName}
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
			<div className="flex flex-col md:flex-row h-full">
				<div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
					<div className="md:sticky md:top-0">
						{renderMetadata(data.metadata)}
					</div>
				</div>
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
