import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Debounce function to prevent excessive API calls while user is typing
const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

const Search = ({
	onLocationSelected,
	searchQuery,
	setSearchQuery,
	onUserTyping,
}) => {
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isUserTypingState, setIsUserTypingState] = useState(false);

	// Function to search for locations based on user input
	// It uses Nominatim API to search for locations
	const searchLocations = useCallback(
		async query => {
			if (query.trim() === '' || !isUserTypingState) {
				// If user input is empty or user is not actively typing, clear results
				setResults([]);
				return;
			}

			setIsLoading(true); // Set loading state to true while searching
			try {
				const response = await axios.get(
					`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
						query
					)}&limit=5`
				);
				setResults(response.data); // Set search results
			} catch (error) {
				console.error('Error searching locations:', error); // Log error if search fails
				setResults([]); // Clear results if search fails
			} finally {
				setIsLoading(false); // Set loading state to false after search is complete
			}
		},
		[isUserTypingState]
	);

	// Debounce search function to prevent excessive API calls
	const debouncedSearch = useCallback(debounce(searchLocations, 300), [
		searchLocations,
	]);

	// Run debounced search function when user input changes
	// This useEffect hook runs the debounced search function whenever the searchQuery state changes
	// It ensures that the search function is not called excessively while user is typing
	useEffect(() => {
		// Call the debounced search function with the current search query
		// The debounced function is the one that makes the actual API call to Nominatim
		debouncedSearch(searchQuery);
	}, [searchQuery, debouncedSearch]);

	// Update parent component when user is typing
	useEffect(() => {
		onUserTyping(isUserTypingState);
	}, [isUserTypingState, onUserTyping]);

	// Handle input change event
	const handleInputChange = e => {
		setIsUserTypingState(true); // Set isUserTypingState to true when user starts typing
		setSearchQuery(e.target.value); // Update searchQuery state with user input
	};

	// Handle input blur event
	const handleInputBlur = () => {
		// Hide suggestions when the input loses focus
		setTimeout(() => setIsUserTypingState(false), 200);
	};

	// Handle location selection event
	const handleLocationSelect = location => {
		onLocationSelected(
			[parseFloat(location.lat), parseFloat(location.lon)],
			location.display_name
		);
		setResults([]);
		setIsUserTypingState(false);
	};

	return (
		<div className="flex justify-center items-center mr-4">
			<div className="text-lg font-semibold text-gray-800 mr-2">
				Location
			</div>
			<div className="relative w-64">
				<div className="flex">
					<input
						type="text"
						value={searchQuery}
						onChange={handleInputChange}
						onFocus={() => setIsUserTypingState(true)}
						onBlur={handleInputBlur}
						placeholder="Search for a location"
						className="pl-4 pr-4 border border-gray-300 rounded-3xl w-full h-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
					{isLoading && (
						<div className="absolute right-3 top-3">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
						</div>
					)}
				</div>
				{isUserTypingState && results.length > 0 && (
					<ul className="absolute top-14 left-0 w-full bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm mt-1 z-10">
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
		</div>
	);
};

export default Search;
