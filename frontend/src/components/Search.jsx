import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

const Search = ({ onLocationSelected, searchQuery, setSearchQuery }) => {
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isUserTyping, setIsUserTyping] = useState(false);

	const searchLocations = useCallback(
		async query => {
			if (query.trim() === '' || !isUserTyping) {
				setResults([]);
				return;
			}

			setIsLoading(true);
			try {
				const response = await axios.get(
					`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
						query
					)}&limit=5`
				);
				setResults(response.data);
			} catch (error) {
				console.error('Error searching locations:', error);
				setResults([]);
			} finally {
				setIsLoading(false);
			}
		},
		[isUserTyping]
	);

	const debouncedSearch = useCallback(debounce(searchLocations, 300), [
		searchLocations,
	]);

	useEffect(() => {
		debouncedSearch(searchQuery);
	}, [searchQuery, debouncedSearch]);

	const handleInputChange = e => {
		setIsUserTyping(true);
		setSearchQuery(e.target.value);
	};

	const handleInputBlur = () => {
		// Hide suggestions when the input loses focus
		setTimeout(() => setIsUserTyping(false), 200);
	};

	const handleLocationSelect = location => {
		onLocationSelected(
			[parseFloat(location.lat), parseFloat(location.lon)],
			location.display_name
		);
		setResults([]);
		setIsUserTyping(false);
	};

	return (
		<div className="relative">
			<input
				type="text"
				value={searchQuery}
				onChange={handleInputChange}
				onFocus={() => setIsUserTyping(true)}
				onBlur={handleInputBlur}
				placeholder="Search for a location"
				className="p-2 border rounded w-full"
			/>
			{isLoading && (
				<div className="absolute right-3 top-3">
					<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
				</div>
			)}
			{isUserTyping && results.length > 0 && (
				<ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-60 overflow-y-auto">
					{results.map(result => (
						<li
							key={result.place_id}
							onClick={() => handleLocationSelect(result)}
							className="p-2 hover:bg-gray-100 cursor-pointer">
							{result.display_name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Search;
