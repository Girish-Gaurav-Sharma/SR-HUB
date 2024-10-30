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

	// Prepare data for different satellites
	const getDatesForSatellite = index =>
		dates.length > index
			? dates[index].allDatesLocal.map(date =>
				new Date(date).toDateString()
			)
			: [];

	const Landsat8 = getDatesForSatellite(0);
	const Landsat9 = getDatesForSatellite(1);
	const sentinel2a = getDatesForSatellite(2);
	const sentinel2b = getDatesForSatellite(3);

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
		<div className="flex flex-col items-center justify-center gap-6 h-full px-4">
			{loading ? (
				// Loading animation with message
				<div className="text-xl font-bold text-blue-600 flex flex-col items-center">
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
				<div className="flex flex-wrap justify-center gap-6">
					{[
						{ name: 'Landsat 8', color: 'red', index: 0 },
						{ name: 'Landsat 9', color: 'yellow', index: 1 },
						{ name: 'Sentinel 2A', color: 'green', index: 2 },
						{ name: 'Sentinel 2B', color: 'blue', index: 3 },
					].map(({ name, color, index }) => (
						<div
							key={index}
							className={`flex items-center justify-between w-full max-w-[250px] bg-${color}-400 backdrop-blur-sm rounded-full p-4 shadow-lg`}>
							<h3 className="text-lg font-semibold text-black">
								{name}
							</h3>
							<span
								className={`flex items-center justify-center bg-${color}-500 backdrop-blur-sm rounded-full px-2 py-1 text-white text-sm`}>
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
								{dates[index]?.timeLocal?.time12Hour || 'N/A'}
							</span>
						</div>
					))}

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
						className="rounded-2xl w-full max-w-3xl h-auto p-4 bg-white shadow-lg text-center text-black"
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
				</div>
			)}
		</div>
	);
};

export default ThreeMonthCalendar;

