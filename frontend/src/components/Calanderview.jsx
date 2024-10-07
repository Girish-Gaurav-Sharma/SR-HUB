import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ThreeMonthCalendar = () => {
	const eventType1 = [
		new Date(2024, 9, 15).toDateString(),
		new Date(2024, 9, 9).toDateString(),
		new Date(2024, 9, 5).toDateString(),
		new Date(2024, 9, 12).toDateString(),
	];
	const eventType2 = [
		new Date(2024, 9, 28).toDateString(),
		new Date(2024, 9, 10).toDateString(),
		new Date(2024, 9, 15).toDateString(),
	];
	const eventType3 = [
		new Date(2024, 9, 28).toDateString(),
		new Date(2024, 9, 10).toDateString(),
	];
	const eventType4 = [
		new Date(2024, 9, 1).toDateString(),
		new Date(2024, 9, 10).toDateString(),
		new Date(2024, 9, 15).toDateString(),
	];

	const getTileContent = ({ date, view }) => {
		if (view === 'month') {
			const dateStr = date.toDateString();
			const events = [
				eventType1.includes(dateStr) ? (
					<div
						key="1"
						className="w-2 h-2 rounded-full bg-red-400 mx-auto mt-1"></div>
				) : null,
				eventType2.includes(dateStr) ? (
					<div
						key="2"
						className="w-2 h-2 rounded-full bg-green-400 mx-auto mt-1"></div>
				) : null,
				eventType3.includes(dateStr) ? (
					<div
						key="3"
						className="w-2 h-2 rounded-full bg-blue-400 mx-auto mt-1"></div>
				) : null,
				eventType4.includes(dateStr) ? (
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

	return (
		<div className="flex  items-center justify-center gap-24 h-full">
			<div className="flex flex-col gap-6 items-center justify-center">
				{/* Landsat 8 */}
				<div className="flex items-center justify-center w-[140px] bg-red-400 backdrop-blur-sm rounded-full p-4 shadow-lg">
					<h3 className="text-lg font-semibold text-black">
						Landsat 8
					</h3>
				</div>

				{/* Sentinel 2A */}
				<div className="flex items-center justify-center w-[140px] bg-yellow-400 backdrop-blur-sm rounded-full p-4 shadow-lg">
					<h3 className="text-lg font-semibold text-black">
						Landsat 9
					</h3>
				</div>

				{/* Sentinel 2A */}
				<div className="flex items-center justify-center w-[140px] bg-green-400 backdrop-blur-sm rounded-full p-4 shadow-lg">
					<h3 className="text-lg font-semibold text-black">
						Sentinel 2A
					</h3>
				</div>

				{/* Sentinel 2B */}
				<div className="flex items-center justify-center w-[140px] bg-blue-400 backdrop-blur-sm rounded-full p-4 shadow-lg">
					<h3 className="text-lg font-semibold text-black">
						Sentinel 2B
					</h3>
				</div>
			</div>

			<Calendar
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
			/>
		</div>
	);
};

export default ThreeMonthCalendar;
