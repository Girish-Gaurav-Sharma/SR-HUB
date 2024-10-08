import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = 'http://localhost:3000';
// const API_URL = 'https://sr-hub-backend.onrender.com';

const ThreeMonthCalendar = ({ latitude, longitude }) => {
	const [dates, setDates] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true); // Added loading state
	const [countdown, setCountdown] = useState(30); // Countdown for 60 seconds
	const today = new Date();
	today.setDate(1); // Set to the first day of the month
	// Calculate the date 4 months from now
	const fourMonthsLater = new Date(
		today.getFullYear(),
		today.getMonth() + 5,
		0 // Set to the last day of the month
	);
	// Countdown logic
	useEffect(() => {
		if (countdown > 0) {
			const timer = setInterval(() => {
				setCountdown(prevCountdown => prevCountdown - 1);
			}, 1000);

			return () => clearInterval(timer); // Clean up the interval on unmount
		} else {
			setLoading(false); // Stop loading when countdown reaches 0
		}
	}, [countdown]);

	// Fetch acquisition dates
	useEffect(() => {
		console.log('Fetching acquisition dates...');
		axios
			.get(
				`${API_URL}/get-acquisition-dates?longitude=${longitude}&latitude=${latitude}`
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
			});
	}, [latitude, longitude]);

	// Prepare data for different satellites
	const Landsat8 =
		dates.length > 0
			? dates[0].allDatesLocal.map(date => new Date(date).toDateString())
			: [];
	const Landsat9 =
		dates.length > 0
			? dates[1].allDatesLocal.map(date => new Date(date).toDateString())
			: [];
	const sentinel2a =
		dates.length > 0
			? dates[2].allDatesLocal.map(date => new Date(date).toDateString())
			: [];
	const sentinel2b =
		dates.length > 0
			? dates[3].allDatesLocal.map(date => new Date(date).toDateString())
			: [];

	// Tile content logic
	const getTileContent = ({ date, view }) => {
		if (view === 'month') {
			const dateStr = date.toDateString();
			const events = [
				Landsat8.includes(dateStr) ? (
					<div
						key="1"
						className="w-2 h-2 rounded-full bg-red-400 mx-auto mt-1"></div>
				) : null,
				sentinel2a.includes(dateStr) ? (
					<div
						key="2"
						className="w-2 h-2 rounded-full bg-green-400 mx-auto mt-1"></div>
				) : null,
				sentinel2b.includes(dateStr) ? (
					<div
						key="3"
						className="w-2 h-2 rounded-full bg-blue-400 mx-auto mt-1"></div>
				) : null,
				Landsat9.includes(dateStr) ? (
					<div
						key="4"
						className="w-2 h-2 rounded-full bg-yellow-400 mx-auto mt-1"></div>
				) : null,
			].filter(Boolean);

			return events.length > 1 ? (
				<div className="flex flex-wrap gap-1">{events}</div>
			) : (
				events[0]
			);
		}
		return null;
	};

	// Helper function to check if two dates are the same day
	const isSameDay = (date1, date2) =>
		date1.toDateString() === date2.toDateString();

	// Render
	return (
		<div className="flex items-center justify-center gap-24 h-full">
			{loading ? (
				// Show loading message with countdown
				<div className="text-xl font-bold text-blue-600 flex flex-col items-center">
					<p>Building Satellite Overpass Calendar...</p>
					<p className="mt-4">
						Countdown: <span className="text-3xl">{countdown}</span>{' '}
						seconds
					</p>
				</div>
			) : dates.length === 0 ? (
				// Show error message if no data is available after countdown
				<div className="text-xl font-bold text-red-600 flex flex-col items-center">
					<p>No data available for the selected location.</p>
					<p>Please try changing the location. Or try again later</p>
				</div>
			) : (
				<>
					<div className="flex flex-col gap-6 items-center justify-center">
						{/* Landsat 8 */}
						<div className="flex items-center justify-between w-[250px] bg-red-400 backdrop-blur-sm rounded-full p-4 shadow-lg">
							<h3 className="text-lg font-semibold text-black">
								Landsat 8{' '}
							</h3>
							<span className="flex items-center justify-center bg-red-500 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{dates[0]?.timeLocal?.time12Hour || 'N/A'}
							</span>
						</div>

						{/* Landsat 9 */}
						<div className="flex items-center justify-between w-[250px] bg-yellow-400 backdrop-blur-sm rounded-full p-4 shadow-lg">
							<h3 className="text-lg font-semibold text-black">
								Landsat 9{' '}
							</h3>
							<span className="flex items-center justify-center bg-yellow-500 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{dates[1]?.timeLocal?.time12Hour || 'N/A'}
							</span>
						</div>

						{/* Sentinel 2A */}
						<div className="flex items-center justify-between w-[250px] bg-green-400 backdrop-blur-sm rounded-full p-4 shadow-lg">
							<h3 className="text-lg font-semibold text-black">
								Sentinel 2A{' '}
							</h3>
							<span className="flex items-center justify-center bg-green-500 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{dates[2]?.timeLocal?.time12Hour || 'N/A'}
							</span>
						</div>

						{/* Sentinel 2B */}
						<div className="flex items-center justify-between w-[250px] bg-blue-400 backdrop-blur-sm rounded-full p-4 shadow-lg">
							<h3 className="text-lg font-semibold text-black">
								Sentinel 2B{' '}
							</h3>
							<span className="flex items-center justify-center bg-blue-500 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{dates[3]?.timeLocal?.time12Hour || 'N/A'}
							</span>
						</div>
					</div>

					<Calendar
						minDate={today} // Show from the current date
						maxDate={fourMonthsLater} // Show up to 4 months later
						selectable={false} // Disable date selection range
						onClickDay={null}
						view="month"
						minDetail="month" // Minimum view level allowed
						maxDetail="month" // Maximum view level allowed
						showNeighboringMonth={false}
						next2Label={null}
						prev2Label={null}
						className="rounded-2xl w-3/5 h-auto p-4 bg-white shadow-lg text-center text-black"
						tileContent={getTileContent}
						navLabel={({ date, view }) => (
							<h3 className="text-2xl font-semibold text-blue-600">
								{date.toLocaleString('default', {
									month: 'long',
									year: 'numeric',
								})}
							</h3>
						)}
						nextLabel={
							<span className="text-blue-600 text-xl font-bold">
								{'>'}
							</span>
						}
						prevLabel={
							<span className="text-blue-600 text-xl font-bold">
								{'<'}
							</span>
						}
						tileClassName={({ date, view }) => {
							let classNames =
								'cursor-default hover:bg-transparent focus:bg-transparent';
							if (isSameDay(date, new Date())) {
								classNames += ' bg-blue-100 rounded-lg';
							}
							return classNames.trim();
						}}
					/>
				</>
			)}
		</div>
	);
};

export default ThreeMonthCalendar;
