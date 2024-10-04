// Import required modules
const express = require('express');
const cors = require('cors');
const { initializeEE, getAcquisitionDates } = require('./gee-server'); // Import the functions

// Create an Express application
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or fallback to 3000 for local development
app.use(cors());

// Initialize Earth Engine
initializeEE()
	.then(() => {
		// Define a route to get acquisition dates with dynamic coordinates
		app.get('/get-acquisition-dates', (req, res) => {
			const { longitude, latitude } = req.query; // Extract longitude and latitude from query parameters

			if (!longitude || !latitude) {
				return res.status(400).json({
					error: 'Longitude and latitude are required.',
				});
			}

			const coordinates = [parseFloat(longitude), parseFloat(latitude)]; // Convert to float

			console.log(
				'Request received for acquisition dates at coordinates:',
				coordinates
			);

			// Call the function to get acquisition dates
			getAcquisitionDates(coordinates)
				.then(acquisitionDates => {
					const daysToAdd = 16;
					const iterations = 10;

					const uniqueSortedDates = processMultipleStartDates(
						acquisitionDates, // Use the dates from acquisitionDates
						daysToAdd,
						iterations
					);
					console.log(uniqueSortedDates, uniqueSortedDates.length);
					// Return the unique sorted dates
					res.json(uniqueSortedDates);
				})
				.catch(err => {
					console.error('Error retrieving acquisition dates:', err);
					res.status(500).json({
						error: 'Failed to retrieve acquisition dates.',
					});
				});
		});

		// Start the server
		app.listen(port, () => {
			console.log(
				`Server running at http://localhost:${port}/get-acquisition-dates`
			);
		});
	})
	.catch(err => {
		console.error('Error initializing Earth Engine:', err);
	});

// Functions for date processing (same as before)
function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function getDatesList(startDate, daysToAdd, iterations) {
	let datesList = [];
	let currentDate = new Date(startDate);

	for (let i = 0; i < iterations; i++) {
		currentDate = addDays(currentDate, daysToAdd);
		datesList.push(currentDate.toISOString().split('T')[0]); // Format the date as YYYY-MM-DD
	}

	// Sort dates from most recent to oldest
	datesList.sort((a, b) => new Date(b) - new Date(a));

	return datesList; // Return array of dates
}

function processMultipleStartDates(startDates, daysToAdd, iterations) {
	let result = [];

	startDates.forEach(startDate => {
		const processedDates = getDatesList(startDate, daysToAdd, iterations);
		result.push(processedDates); // Store each list of dates
	});

	// Merge all lists into a single list, remove duplicates
	const mergedUniqueDates = [...new Set([].concat(...result))]; // Remove duplicates

	// Sort from most recent to oldest
	mergedUniqueDates.sort((a, b) => new Date(b) - new Date(a));

	// Find the most recent date in the input startDates
	const mostRecentInputDate = new Date(
		Math.max(...startDates.map(date => new Date(date)))
	);

	// Filter the dates to keep only those greater than the most recent input date
	const filteredDates = mergedUniqueDates.filter(
		date => new Date(date) > mostRecentInputDate
	);

	return filteredDates; // Return unique sorted dates that are greater than the most recent input date
}
