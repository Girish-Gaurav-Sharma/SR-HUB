import React, { useState, useEffect } from 'react';
import axios from 'axios';
const port = 'https://sr-hub-backend.onrender.com';
const SatelliteImageGallery = ({ lat, lng, startDate, endDate }) => {
	// State for satellite data
	const [data, setData] = useState([]);

	// State for filters and sorting
	const [selectedSatellites, setSelectedSatellites] = useState([]);
	const [cloudCoverRange, setCloudCoverRange] = useState([0, 100]);
	const [sortOption, setSortOption] = useState({
		field: 'date',
		order: 'desc',
	});

	// Fetch data from the API
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${port}/get-full-metadata?longitude=${lng}&latitude=${lat}&startDate=${startDate}&endDate=${endDate}`
				);
				const fetchedData = response.data;

				setData(fetchedData);

				// Extract unique satellite names
				const satelliteNames = [
					...new Set(fetchedData.map(item => item.satellite_name)),
				];
				setSelectedSatellites(satelliteNames);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	// Filtered and sorted data
	const [filteredData, setFilteredData] = useState([]);

	// Update filtered data whenever filters or sorting change
	useEffect(() => {
		let filtered = data.filter(
			item =>
				selectedSatellites.includes(item.satellite_name) &&
				item.cloudcover >= cloudCoverRange[0] &&
				item.cloudcover <= cloudCoverRange[1]
		);

		// Sort data
		if (sortOption.field === 'date') {
			filtered.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return sortOption.order === 'asc'
					? dateA - dateB
					: dateB - dateA;
			});
		} else if (sortOption.field === 'cloudcover') {
			filtered.sort((a, b) => {
				return sortOption.order === 'asc'
					? a.cloudcover - b.cloudcover
					: b.cloudcover - a.cloudcover;
			});
		}

		setFilteredData(filtered);
	}, [selectedSatellites, cloudCoverRange, sortOption, data]);

	// Handlers for filters and sorting options
	const handleSatelliteChange = satelliteName => {
		if (selectedSatellites.includes(satelliteName)) {
			setSelectedSatellites(
				selectedSatellites.filter(name => name !== satelliteName)
			);
		} else {
			setSelectedSatellites([...selectedSatellites, satelliteName]);
		}
	};

	const handleCloudCoverChange = event => {
		const value = parseInt(event.target.value);
		setCloudCoverRange([0, value]);
	};

	const handleSortFieldChange = event => {
		setSortOption({ ...sortOption, field: event.target.value });
	};

	const handleSortOrderChange = event => {
		setSortOption({ ...sortOption, order: event.target.value });
	};

	return (
		<div className="satellite-image-gallery flex fixed inset-0 z-50 bg-white">
			{/* Left Column */}
			<div className="w-1/4 p-4 bg-gray-100 flex flex-col">
				{/* Sorting options */}
				<div className="mb-6">
					<h2 className="text-xl font-semibold mb-2">Sort Options</h2>
					<div className="flex flex-col space-y-2">
						<div>
							<label className="mr-2 font-semibold">
								Sort by:
							</label>
							<select
								value={sortOption.field}
								onChange={handleSortFieldChange}
								className="border rounded p-1 w-full">
								<option value="date">Date</option>
								<option value="cloudcover">Cloud Cover</option>
							</select>
						</div>
						<div>
							<label className="mr-2 font-semibold">Order:</label>
							<select
								value={sortOption.order}
								onChange={handleSortOrderChange}
								className="border rounded p-1 w-full">
								<option value="asc">Ascending</option>
								<option value="desc">Descending</option>
							</select>
						</div>
					</div>
				</div>
				{/* Filters */}
				<div className="flex-1 overflow-auto">
					{/* Satellite checkboxes */}
					<div className="mb-6">
						<h2 className="text-xl font-semibold mb-2">
							Satellite Name
						</h2>
						{[
							...new Set(data.map(item => item.satellite_name)),
						].map(name => (
							<div
								key={name}
								className="mb-1">
								<label className="inline-flex items-center">
									<input
										type="checkbox"
										className="form-checkbox"
										checked={selectedSatellites.includes(
											name
										)}
										onChange={() =>
											handleSatelliteChange(name)
										}
									/>
									<span className="ml-2">{name}</span>
								</label>
							</div>
						))}
					</div>
					{/* Cloud cover slider */}
					<div className="mb-6">
						<h2 className="text-xl font-semibold mb-2">
							Cloud Cover ({cloudCoverRange[0]}% -{' '}
							{cloudCoverRange[1]}%)
						</h2>
						<input
							type="range"
							min="0"
							max="100"
							value={cloudCoverRange[1]}
							onChange={handleCloudCoverChange}
							className="w-full"
						/>
					</div>
				</div>
			</div>
			{/* Right Column */}
			<div className="w-3/4 flex flex-col">
				{/* Images */}
				<div className="flex-1 overflow-y-auto p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredData.map((item, index) => (
							<div
								key={index}
								className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow duration-200">
								{item.real_image_url ? (
									<img
										src={item.real_image_url}
										alt={`Scene ${item.systemId}`}
										className="w-full h-48 object-cover mb-2 rounded"
									/>
								) : (
									<div className="w-full h-48 flex items-center justify-center bg-gray-200 mb-2 rounded">
										<p>Error loading image</p>
									</div>
								)}
								<div>
									<p>
										<strong>Satellite:</strong>{' '}
										{item.satellite_name}
									</p>
									<p>
										<strong>Date:</strong> {item.date}
									</p>
									<p>
										<strong>Cloud Cover:</strong>{' '}
										{item.cloudcover}%
									</p>
									<p>
										<strong>Scene ID:</strong>{' '}
										{item.systemId}
									</p>
									{item.error && (
										<p className="text-red-500">
											<strong>Error:</strong> {item.error}
										</p>
									)}
								</div>
							</div>
						))}
						{filteredData.length === 0 && (
							<p>No images match the selected filters.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SatelliteImageGallery;
