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
