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
module.exports = { processMultipleStartDates };
