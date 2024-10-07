import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ThreeMonthCalendar = () => {
	const eventType1 = [
		new Date(2024, 9, 15).toDateString(),
		new Date(2024, 9, 20).toDateString(),
		new Date(2024, 9, 5).toDateString(),
		new Date(2024, 9, 12).toDateString(),
	];
	const eventType2 = [
		new Date(2024, 9, 28).toDateString(),
		new Date(2024, 9, 30).toDateString(),
		new Date(2024, 9, 15).toDateString(),
	];
	const eventType3 = [
		new Date(2024, 9, 28).toDateString(),
		new Date(2024, 9, 30).toDateString(),
	];
	const eventType4 = [
		new Date(2024, 9, 1).toDateString(),
		new Date(2024, 9, 10).toDateString(),
		new Date(2024, 9, 15).toDateString(),
	];

	const getTileClassName = ({ date, view }) => {
		if (view === 'month') {
			const dateStr = date.toDateString();
			if (eventType1.includes(dateStr)) {
				return 'bg-red-300 text-white';
			}
			if (eventType2.includes(dateStr)) {
				return 'bg-green-300 text-white';
			}
			if (eventType3.includes(dateStr)) {
				return 'bg-blue-300 text-white';
			}
			if (eventType4.includes(dateStr)) {
				return 'bg-yellow-300 text-white';
			}
		}
		return '';
	};

	return (
		<div className="flex items-center justify-between h-full">
			<div className="flex  flex-col gap-6 items-center justify-center">
				{/* Landsat 8 */}
				<div className="w-[140px] bg-red-500 backdrop-blur-sm rounded-full p-4 shadow-lg">
					<h3 className="text-lg font-semibold text-black">
						Landsat 8
					</h3>
				</div>

				{/* Sentinel 2A */}
				<div className="w-[140px] bg-yellow-500 backdrop-blur-sm rounded-full p-4 shadow-lg">
					<h3 className="text-lg font-semibold text-black">
						Sentinel 2A
					</h3>
				</div>

				{/* Sentinel 2A */}
				<div className="w-[140px] bg-green-500 backdrop-blur-sm rounded-full p-4 shadow-lg">
					<h3 className="text-lg font-semibold text-black">
						Sentinel 2A
					</h3>
				</div>

				{/* Sentinel 2B */}
				<div className="w-[140px] bg-blue-500 backdrop-blur-sm rounded-full p-4 shadow-lg">
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
				tileClassName={getTileClassName}
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
