// Import required modules
require('dotenv').config();
const ee = require('@google/earthengine');
// const key = process.env.SR_DATA_COMPARISON_PRIVATE_KEY;
// const geejson = require('./JSON/sr-data-comparison-1b68f9eda759.json');
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

// Function to get acquisition dates
const getAcquisitionDates = async coordinates => {
	return new Promise((resolve, reject) => {
		// Define a point using the coordinates
		const point = ee.Geometry.Point(coordinates);

		// Filter the LANDSAT 9 ImageCollection by the point
		const dataset = ee
			.ImageCollection('LANDSAT/LC08/C02/T1_RT')
			.filterBounds(point)
			.sort('system:time_start', false) // Sort by date, latest first
			.limit(30); // Limit to the last 30 acquisitions

		// Extract acquisition time and date for the last 30 images
		const acquisitionDates = dataset
			.aggregate_array('system:time_start')
			.map(time => {
				return ee.Date(time).format('YYYY-MM-dd');
			});

		// Call getInfo directly and handle the result
		acquisitionDates.getInfo(
			dates => {
				if (dates) {
					console.log('Acquisition Dates and Times:', dates);
					resolve(dates); // Resolve with the dates
				} else {
					console.error('No acquisition dates found');
					resolve([]); // Resolve with an empty array if no dates found
				}
			},
			err => {
				console.error('Error retrieving dates:', err);
				reject(err); // Reject with the error
			}
		);
	});
};

module.exports = { initializeEE, getAcquisitionDates };
