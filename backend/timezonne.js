const tzLookup = require('tz-lookup');

/**
 * Converts UTC time to local time based on latitude and longitude using native JavaScript.
 * Returns both 24-hour and 12-hour formats.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @param {string} date - Date in 'YYYY-MM-DD' format.
 * @param {string} time - Time in 'HH:mm:ss' format.
 * @returns {object} Object containing both 24-hour and 12-hour formatted times.
 */
function timeConversion(lat, lon, date, time) {
	// Get the IANA time zone name from latitude and longitude
	const timezone = tzLookup(lat, lon);

	// Combine date and time into a single UTC datetime string
	const dateTimeStr = `${date}T${time}Z`;

	// Create a Date object in UTC
	const dateTime = new Date(dateTimeStr);

	// Convert to local time in 24-hour format
	const options24 = {
		timeZone: timezone,
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	};
	const time24Hour = new Intl.DateTimeFormat('en-US', options24).format(
		dateTime
	);

	// Convert to local time in 12-hour format
	const options12 = {
		timeZone: timezone,
		hour12: true,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	};
	const time12Hour = new Intl.DateTimeFormat('en-US', options12).format(
		dateTime
	);

	// Return both formats as an object
	return {
		time24Hour: time24Hour,
		time12Hour: time12Hour,
	};
}

/**
 * Converts UTC date to local date based on latitude and longitude using native JavaScript.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @param {string} date - Date in 'YYYY-MM-DD' format.
 * @param {string} time - Time in 'HH:mm:ss' format.
 * @returns {string} Local date in 'YYYY-MM-DD' format.
 */
function dateConversion(lat, lon, date, time) {
	// Get the IANA time zone name from latitude and longitude
	const timezone = tzLookup(lat, lon);

	// Combine date and time into a single UTC datetime string
	const dateTimeStr = `${date}T${time}Z`;

	// Create a Date object in UTC
	const dateTime = new Date(dateTimeStr);

	// Convert the date and time using Intl.DateTimeFormat
	const options = {
		timeZone: timezone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	};
	const localDate = new Intl.DateTimeFormat('en-CA', options).format(
		dateTime
	); // 'en-CA' for YYYY-MM-DD format

	return localDate;
}

module.exports = {
	timeConversion,
	dateConversion,
};
