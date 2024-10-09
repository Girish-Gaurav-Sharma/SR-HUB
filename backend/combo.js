// Import required modules
require('dotenv').config();
const ee = require('@google/earthengine');
const geejson = require('./JSON/sr-data-comparison-1b68f9eda759.json'); // Update with your service account JSON

// Initialize Earth Engine with your service account
const initializeEE = () => {
	return new Promise((resolve, reject) => {
		ee.data.authenticateViaPrivateKey(geejson, () => {
			ee.initialize(null, null, () => {
				console.log('Earth Engine client library initialized');
				resolve();
			});
		});
	});
};
const LANDSAT_SCALING_FACTOR = 0.0000275;
// Fetch Sentinel-2 data
const fetchSentinel2Data = async (
	coordinates,
	imageBufferSize,
	startDate,
	endDate,
	spacecraftName
) => {
	try {
		const point = ee.Geometry.Point(coordinates);
		const imageBuffer = point.buffer(imageBufferSize);

		const dataset = ee
			.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
			.filterDate(startDate, endDate)
			.filterBounds(point)
			.filter(ee.Filter.eq('SPACECRAFT_NAME', spacecraftName));

		const imageList = dataset.toList(dataset.size());
		const numImages = imageList.size().getInfo();

		let results = [];
		for (let i = 0; i < numImages; i++) {
			const image = ee.Image(imageList.get(i));
			const imageMetadata = await getSentinel2ImageMetadata(image);
			const rgbUrl = await generateSentinel2RGBThumbnailUrl(
				image,
				imageBuffer
			);

			const result = {
				coordinates,
				systemId: imageMetadata['system:id'],
				satellite_name: imageMetadata['SPACECRAFT_NAME'],
				cloudcover: imageMetadata['CLOUDY_PIXEL_PERCENTAGE'],
				date: imageMetadata.acquisitionDate,
				real_image_url: rgbUrl,
			};

			results.push(result);
		}
		return results;
	} catch (error) {
		console.error(
			`Error fetching Sentinel-2 data (${spacecraftName}):`,
			error
		);
		return [
			{
				coordinates,
				satellite_name: spacecraftName,
				error: error.toString(),
			},
		];
	}
};

const generateSentinel2RGBThumbnailUrl = async (image, region) => {
	return await image.select(['B4', 'B3', 'B2']).getThumbURL({
		min: 0,
		max: 3000,
		region: region,
		scale: 10,
	});
};

const getSentinel2ImageMetadata = async image => {
	const properties = [
		'CLOUDY_PIXEL_PERCENTAGE',
		'system:id',
		'SPACECRAFT_NAME',
		'system:time_start',
	];

	const metadata = {};
	for (const prop of properties) {
		metadata[prop] = image.get(prop).getInfo();
	}
	metadata.acquisitionDate = new Date(
		metadata['system:time_start']
	).toISOString();
	return metadata;
};

// Fetch Landsat data
const applyLandsatScaling = image => {
	return image.multiply(LANDSAT_SCALING_FACTOR).add(-0.2);
};
// Function to extract date from system:index (which follows a structure like LC08_201023_YYYYMMDD)
const extractDateFromSystemIndex = systemIndex => {
	// The systemIndex follows a structure like 'LC08_201023_20240917'
	// The date is at the end of the string in YYYYMMDD format
	const parts = systemIndex.split('_');
	if (parts.length > 2) {
		const dateStr = parts[2]; // Extract the date part
		const year = dateStr.substring(0, 4);
		const month = dateStr.substring(4, 6);
		const day = dateStr.substring(6, 8);
		return `${year}-${month}-${day}`; // Return date in YYYY-MM-DD format
	}
	return 'N/A'; // If no valid date part found, return 'N/A'
};

// Fetch Landsat data with scaling applied
const fetchLandsatData = async (
	coordinates,
	imageBufferSize,
	startDate,
	endDate,
	satellite
) => {
	try {
		const point = ee.Geometry.Point(coordinates);
		const imageBuffer = point.buffer(imageBufferSize);

		const collectionId =
			satellite === 'Landsat 8'
				? 'LANDSAT/LC08/C02/T1_L2'
				: 'LANDSAT/LC09/C02/T1_L2';

		const dataset = ee
			.ImageCollection(collectionId)
			.filterDate(startDate, endDate)
			.filterBounds(point);

		const scaledDataset = dataset.map(applyLandsatScaling); // Apply scaling to the image collection

		const imageList = scaledDataset.toList(scaledDataset.size());
		const numImages = imageList.size().getInfo();

		let results = [];
		for (let i = 0; i < numImages; i++) {
			const image = ee.Image(imageList.get(i));
			const imageMetadata = await getLandsatImageMetadata(image);
			const rgbUrl = await generateLandsatRGBThumbnailUrl(
				image,
				imageBuffer
			);

			const result = {
				coordinates,
				systemId: imageMetadata['system:index'] || 'N/A',
				satellite_name: satellite,
				date: imageMetadata.acquisitionDate, // Use the acquisition date retrieved from the metadata
				cloudcover: imageMetadata.cloudCover, // Use extracted cloud cover
				real_image_url: rgbUrl,
			};

			results.push(result);
		}
		return results;
	} catch (error) {
		console.error(`Error fetching ${satellite} data:`, error);
		return [
			{
				coordinates,
				satellite_name: satellite,
				error: error.toString(),
			},
		];
	}
};

// Generate RGB thumbnail URL for Landsat data
const generateLandsatRGBThumbnailUrl = async (image, region) => {
	return await image.select(['SR_B4', 'SR_B3', 'SR_B2']).getThumbURL({
		min: 0,
		max: 0.3, // Reflectance range after applying scaling factor
		region: region,
		scale: 30,
	});
};

// Fetch Landsat metadata with the correct property names for Collection 2
// Fetch Landsat metadata with corrected property names and fallback for acquisition date and cloud cover
// Fetch Landsat metadata with correct property names and asynchronous handling for acquisition date and cloud cover
const getLandsatImageMetadata = async image => {
	try {
		const properties = [
			'system:index', // Unique identifier for the image
			'DATE_ACQUIRED', // Preferred property for acquisition date
			'system:time_start', // Fallback timestamp when the image was acquired
			'CLOUD_COVER', // General cloud cover
			'CLOUD_COVER_LAND', // Fallback cloud cover over land
		];

		// Create a metadata object to store the results
		const metadata = {};

		// Fetch each property asynchronously
		for (const prop of properties) {
			const value = await image.get(prop).getInfo(); // Ensure async retrieval
			metadata[prop] = value;
		}

		// Extract acquisition date: first try DATE_ACQUIRED, then system:time_start, finally system:index
		if (metadata['DATE_ACQUIRED']) {
			metadata.acquisitionDate = metadata['DATE_ACQUIRED']; // Already in YYYY-MM-DD format
		} else if (metadata['system:time_start']) {
			metadata.acquisitionDate = new Date(metadata['system:time_start'])
				.toISOString()
				.split('T')[0]; // Convert to ISO date (YYYY-MM-DD)
		} else if (metadata['system:index']) {
			metadata.acquisitionDate = extractDateFromSystemIndex(
				metadata['system:index']
			); // Extract from system:index
		} else {
			metadata.acquisitionDate = 'N/A'; // Handle case where acquisition date is not available
		}

		// Handle cloud cover: try CLOUD_COVER, then CLOUD_COVER_LAND
		metadata.cloudCover =
			metadata['CLOUD_COVER'] || metadata['CLOUD_COVER_LAND'] || 'N/A';

		return metadata; // Return the metadata object with acquisition date and cloud cover
	} catch (error) {
		console.error('Error fetching metadata:', error);
		return {
			systemId: 'N/A',
			acquisitionDate: 'N/A',
			cloudCover: 'N/A',
			error: error.toString(),
		};
	}
};

// Function to extract date from system:index

// Fetch HLS data
const fetchHLSData = async (
	coordinates,
	imageBufferSize,
	startDate,
	endDate
) => {
	try {
		const point = ee.Geometry.Point(coordinates);
		const imageBuffer = point.buffer(imageBufferSize);

		const dataset = ee
			.ImageCollection('NASA/HLS/HLSL30/v002')
			.filterDate(startDate, endDate)
			.filterBounds(point)
			.map(maskClouds);

		const imageList = dataset.toList(dataset.size());
		const numImages = imageList.size().getInfo();

		let results = [];
		for (let i = 0; i < numImages; i++) {
			const image = ee.Image(imageList.get(i));
			const imageMetadata = await getHLSImageMetadata(image);
			const rgbUrl = await generateHLSRGBThumbnailUrl(image, imageBuffer);

			const result = {
				coordinates,
				systemId: imageMetadata['system:id'],
				satellite_name: 'HLS',
				date: imageMetadata['DATE'],
				cloudcover: imageMetadata['CLOUD_COVERAGE'],
				real_image_url: rgbUrl,
			};

			results.push(result);
		}
		return results;
	} catch (error) {
		console.error('Error fetching HLS data:', error);
		return [
			{
				coordinates,
				satellite_name: 'HLS',
				error: error.toString(),
			},
		];
	}
};

function maskClouds(image) {
	const qa = image.select('Fmask');
	const cloudMask = qa.bitwiseAnd(1).eq(0);
	return image.updateMask(cloudMask);
}

const generateHLSRGBThumbnailUrl = async (image, region) => {
	return await image.select(['B4', 'B3', 'B2']).getThumbURL({
		min: 0,
		max: 0.3,
		region: region,
		scale: 30,
	});
};

const getHLSImageMetadata = async image => {
	const properties = ['CLOUD_COVERAGE', 'system:id', 'system:time_start'];

	const metadata = {};
	for (const prop of properties) {
		metadata[prop] = image.get(prop).getInfo();
	}
	metadata['DATE'] = new Date(metadata['system:time_start']).toISOString();
	return metadata;
};

// Fetch data from all satellites
const fetchAllSatelliteData = async (coordinates, startDate, endDate) => {
	const imageBufferSize = 5000; // Adjust buffer size as needed

	let allResults = [];

	// Initialize Earth Engine
	await initializeEE();

	// Fetch data from all satellites
	const promises = [];

	promises.push(
		fetchSentinel2Data(
			coordinates,
			imageBufferSize,
			startDate,
			endDate,
			'Sentinel-2A'
		)
	);
	promises.push(
		fetchSentinel2Data(
			coordinates,
			imageBufferSize,
			startDate,
			endDate,
			'Sentinel-2B'
		)
	);
	promises.push(
		fetchLandsatData(
			coordinates,
			imageBufferSize,
			startDate,
			endDate,
			'Landsat 8'
		)
	);
	promises.push(
		fetchLandsatData(
			coordinates,
			imageBufferSize,
			startDate,
			endDate,
			'Landsat 9'
		)
	);
	promises.push(
		fetchHLSData(coordinates, imageBufferSize, startDate, endDate)
	);

	const results = await Promise.all(promises);

	results.forEach(satelliteResults => {
		allResults = allResults.concat(satelliteResults);
	});

	return allResults;
};

// Export the function for use in main server file
module.exports = {
	fetchAllSatelliteData,
};
