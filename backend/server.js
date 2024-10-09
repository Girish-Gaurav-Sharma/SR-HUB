// Import required modules
const express = require('express');
const cors = require('cors');
const {
	initializeEE,
	getAcquisitionDatesForSatellites,
} = require('./gee-server'); // Import the functions
// const { checkAllDateTime } = require('./firebase');
const { fetchAllSatelliteData } = require('./combo');
// Create an Express application
const app = express();
const port = process.env.PORT || 5000; // Use the PORT environment variable or fallback to 3000 for local development

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
			getAcquisitionDatesForSatellites(coordinates)
				.then(acquisitionDates => {
					// Return the unique sorted dates
					console.log(
						'Acquisition dates yhi hai bhai:',
						acquisitionDates
					);
					res.json(acquisitionDates);
				})
				.catch(err => {
					console.error('Error retrieving acquisition dates:', err);
					res.status(500).json({
						error: 'Failed to retrieve acquisition dates.',
					});
				});
		});

		// Endpoint to call the functions defined in somwhere
		app.get('/get-full-metadata', async (req, res) => {
			const { longitude, latitude, startDate, endDate } = req.query; // Extract longitude, latitude, startDate, and endDate from query parameters

			// Check if all required query parameters are provided
			if (!longitude || !latitude || !startDate || !endDate) {
				return res.status(400).json({
					error: 'Longitude, latitude, startDate, and endDate are required.',
				});
			}

			// Convert longitude and latitude to float values
			const coordinates = [parseFloat(longitude), parseFloat(latitude)];

			console.log(
				'Request received for full metadata at coordinates:',
				coordinates,
				'with date range:',
				startDate,
				endDate
			);

			try {
				// Call the function to get full metadata using coordinates, startDate, and endDate
				const metadata = await fetchAllSatelliteData(
					coordinates,
					startDate,
					endDate
				);
				console.log(metadata);
				// Return the metadata as JSON response
				res.json(metadata);
			} catch (err) {
				// Handle any errors that occur during the metadata retrieval
				console.error('Error retrieving full metadata:', err);
				res.status(500).json({
					error: 'Failed to retrieve full metadata.',
				});
			}
		});

		// Start the Express server

		// // Endpoint to run the check for date and time
		// app.get('/runCheck', async (req, res) => {
		// 	try {
		// 		const result = await checkAllDateTime(); // Call the function only when this endpoint is hit
		// 		res.status(200).send(result);
		// 	} catch (error) {
		// 		console.error('Error in /runCheck:', error);
		// 		res.status(500).send({
		// 			message: 'An error occurred',
		// 			error: error.message,
		// 		});
		// 	}
		// });

		// Start the server
		app.listen(port, () => {
			console.log(`Server running at http://localhost:${port}/`);
		});
	})
	.catch(err => {
		console.error('Error initializing Earth Engine:', err);
	});
