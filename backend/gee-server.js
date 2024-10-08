require('dotenv').config();
const { processMultipleStartDates } = require('./dateUtils');
const ee = require('@google/earthengine');
// const geejson = require('./JSON/sr-data-comparison-1b68f9eda759');
const { timeConversion, dateConversion } = require('./timezonne');

// Initialize Earth Engine with your service account
const initializeEE = () => {
	return new Promise((resolve, reject) => {
		const geejson = JSON.parse(process.env.GEE_SERVICE_ACCOUNT_KEY);
		ee.data.authenticateViaPrivateKey(geejson, () => {
			ee.initialize(null, null, () => {
				console.log('Earth Engine client library initialized');
				resolve();
			});
		});
	});
};

const getAcquisitionDatesForSatellites = async coordinates => {
	// Define the satellite collections and spacecraft names
	const satelliteCollections = {
		LANDSAT_8: {
			collection: 'LANDSAT/LC08/C02/T1_RT',
		},
		LANDSAT_9: {
			collection: 'LANDSAT/LC09/C02/T1_L2',
		},
		SENTINEL_2A: {
			collection: 'COPERNICUS/S2_SR_HARMONIZED',
			spacecraftName: 'Sentinel-2A',
		},
		SENTINEL_2B: {
			collection: 'COPERNICUS/S2_SR_HARMONIZED',
			spacecraftName: 'Sentinel-2B',
		},
	};

	// Helper function to process a single satellite
	const processSatellite = async (
		collection,
		point,
		spacecraftName = null
	) => {
		let dataset = ee
			.ImageCollection(collection)
			.filterBounds(point)
			.sort('system:time_start', false)
			.limit(5);

		// Apply spacecraft_name filter if provided (for Sentinel-2A and 2B)
		if (spacecraftName) {
			dataset = dataset.filter(
				ee.Filter.eq('SPACECRAFT_NAME', spacecraftName)
			);
		}

		const acquisitionDates = dataset.aggregate_array('system:time_start');
		const latestImage = dataset.first();
		const latestAcquisitionTime = latestImage
			.date()
			.format('YYYY-MM-dd HH:mm:ss');

		// Call getInfo directly and handle the result for both dates and time
		const [dates, lastTime] = await Promise.all([
			acquisitionDates.getInfo(),
			latestAcquisitionTime.getInfo(),
		]);

		// Extract latitude and longitude from the coordinates array
		const [lon, lat] = coordinates;

		if (dates) {
			// Process the time using timeConversion for local time
			const timeUTC = lastTime.slice(11, 19); // Extract the time in UTC
			const timeLocal = timeConversion(
				lat,
				lon,
				lastTime.slice(0, 10),
				timeUTC
			); // Convert to local time

			// Process dates for both UTC and local time zones
			const predictedDatesUTC = processMultipleStartDates(dates, 16, 10);
			const predictedDatesLocal = predictedDatesUTC.map(
				dateString =>
					dateConversion(
						lat,
						lon,
						new Date(dateString).toISOString().slice(0, 10),
						'00:00:00'
					) // Convert each date to local
			);

			const pastDatesUTC = dates.map(dateString =>
				new Date(dateString).toISOString().slice(0, 10)
			);
			const pastDatesLocal = pastDatesUTC.map(
				dateString => dateConversion(lat, lon, dateString, '00:00:00') // Convert each date to local
			);

			const allDatesUTC = [...predictedDatesUTC, ...pastDatesUTC];
			const allDatesLocal = [...predictedDatesLocal, ...pastDatesLocal];

			return {
				timeUTC,
				timeLocal, // Object with both 24-hour and 12-hour formats
				predictedDatesUTC,
				predictedDatesLocal,
				pastDatesUTC,
				pastDatesLocal,
				allDatesUTC,
				allDatesLocal,
			};
		} else {
			return {
				timeUTC: null,
				timeLocal: null,
				predictedDatesUTC: [],
				predictedDatesLocal: [],
				pastDatesUTC: [],
				pastDatesLocal: [],
				allDatesUTC: [],
				allDatesLocal: [],
			};
		}
	};

	// Define a point using the coordinates
	const point = ee.Geometry.Point(coordinates);

	// Process all satellites in series and collect results
	const satelliteResults = [];
	for (const [satellite, { collection, spacecraftName }] of Object.entries(
		satelliteCollections
	)) {
		const result = await processSatellite(
			collection,
			point,
			spacecraftName
		);
		satelliteResults.push({
			satellite,
			...result,
		});
	}

	// Return the results for all satellites
	return satelliteResults;
};

// Usage example

module.exports = { initializeEE, getAcquisitionDatesForSatellites };
