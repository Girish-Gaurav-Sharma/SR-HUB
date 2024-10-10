import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
const ThreeMonthCalendar = ({ dates }) => {
	const [loading, setLoading] = useState(true);

	let intervalId;
	const checkDates = () => {
		if (dates.length !== 0) {
			setLoading(false);
			clearInterval(intervalId);
		}
	};
	intervalId = setInterval(checkDates, 100);
	console.log('Loading:', loading);
	console.log('dates:', dates);
	const today = new Date();
	today.setDate(1); // Set to the first day of the month
	const fourMonthsLater = new Date(
		today.getFullYear(),
		today.getMonth() + 5,
		0 // Set to the last day of the month
	);

	// Fetch acquisition dates

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
				// Loading animation with message
				<div className="text-xl font-bold text-blue-600 flex flex-col items-center">
					{/* Loading spinner with CSS animation */}
					<div className="loader-spinner rounded-full border-t-4 border-b-4 border-blue-500 w-16 h-16 animate-spin"></div>
					<p className="mt-4">
						Building Satellite Overpass Calendar...
					</p>
					<p className="mt-2 text-lg text-gray-700">
						It usually takes around 60 seconds.
					</p>
				</div>
			) : dates.length === 0 ? (
				// Error message
				<div className="text-xl font-bold text-red-600 flex flex-col items-center">
					<p>No data available for the selected location.</p>
					<p>Please try changing the location or try again later.</p>
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
						selectable={false}
						onClickDay={null}
						view="month"
						minDetail="month"
						maxDetail="month"
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
