import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AcquisitionDates = ({ latitude, longitude }) => {
	const [dates, setDates] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true); // Added loading state
	console.log(latitude);
	console.log('yha se aya');
	console.log(longitude);
	useEffect(() => {
		console.log('Fetching acquisition dates...');
		axios
			.get(
				`http://localhost:3000/get-acquisition-dates?longitude=${longitude}&latitude=${latitude}`
			)
			.then(response => {
				console.log('Response received:', response); // Log the response
				if (response.status === 200) {
					setDates(response.data); // Set dates if successful
				} else {
					setError(`Unexpected response code: ${response.status}`);
					console.error(
						'Error:',
						`Unexpected response code: ${response.status}`
					);
				}
			})
			.catch(error => {
				console.error('Error during fetch:', error); // Log the full error object
				setError(
					error.response
						? `Server error: ${error.response.status} - ${error.response.data}`
						: `Network error: ${error.message}`
				);
			})
			.finally(() => {
				setLoading(false); // Set loading to false after the request is done
				console.log('Fetch attempt complete');
			});
	}, [latitude, longitude]);

	// Render a loading message, the dates, or an error if it occurs
	return (
		<div>
			<h1>Acquisition Dates</h1>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'red' }}>Error: {error}</p>}
			<ul>
				{dates.length > 0
					? dates.map((date, index) => <li key={index}>{date}</li>)
					: !loading && <p>No dates available.</p>}
			</ul>
		</div>
	);
};

export default AcquisitionDates;
