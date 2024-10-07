import React from 'react';
import { Calendar } from 'antd';
import 'antd/dist/reset.css'; // Ant Design styles
import { Tooltip } from 'antd';

const ThreeMonthCalendar = () => {
	// Example of your satellite observation dates
	const satelliteDates = [
		new Date('2024-10-15'),
		new Date('2024-10-25'),
		new Date('2024-11-05'),
		new Date('2024-10-10'),
		new Date('2024-10-18'),
		new Date('2024-10-28'),
	];

	// Function to check if the date matches any of your satellite dates
	const isSatelliteDate = date => {
		return satelliteDates.some(
			satDate =>
				satDate.getFullYear() === date.getFullYear() &&
				satDate.getMonth() === date.getMonth() &&
				satDate.getDate() === date.getDate()
		);
	};

	// Custom date cell rendering function
	const dateCellRender = value => {
		const date = value.toDate(); // Convert Ant Design moment date to JavaScript Date

		if (isSatelliteDate(date)) {
			return (
				<Tooltip title="Satellite Data Collection">
					<div className="dot-container">
						<div className="dot bg-blue-500 mx-auto w-2 h-2 rounded-full mt-1"></div>
					</div>
				</Tooltip>
			);
		}
		return <div>{value.date()}</div>;
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-4/5 h-[80vh]">
				<h2 className="text-xl mb-4 text-center">
					Satellite Observation Calendar
				</h2>
				<Calendar
					dateCellRender={dateCellRender}
					style={{ height: '100%' }}
				/>
			</div>
		</div>
	);
};

export default ThreeMonthCalendar;
