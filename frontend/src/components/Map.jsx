import React, { useEffect, useCallback } from 'react';
import L from 'leaflet'; // Add this import to configure leaflet marker
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import the marker icon images from Leaflet package
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the marker icon not showing after deployment
const defaultIcon = L.icon({
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
	iconSize: [25, 41], // Size of the icon
	iconAnchor: [12, 41], // Point where the icon is anchored
	popupAnchor: [1, -34], // Point where the popup should open
	shadowSize: [41, 41], // Size of the shadow
});
L.Marker.prototype.options.icon = defaultIcon;

const MapContent = ({
	center,
	selectedLocation,
	onLocationChange,
	onZoomChange,
}) => {
	const map = useMap();

	useEffect(() => {
		map.setView(center);
		map.zoomControl.setPosition('bottomright');
	}, [center, map]);

	const handleClick = useCallback(
		e => {
			const { lat, lng } = e.latlng;
			onLocationChange(
				[lat, lng],
				null, // Pass null as displayName to trigger reverse geocoding
				false // Don't autocenter on pin drop
			);
		},
		[onLocationChange]
	);

	useMapEvents({
		click: handleClick,
		zoomend: () => {
			onZoomChange(map.getZoom());
		},
	});

	return (
		<>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{selectedLocation && (
				<Marker position={selectedLocation.coordinates}>
					<Popup>{selectedLocation.displayName}</Popup>
				</Marker>
			)}
		</>
	);
};

const Map = React.forwardRef(
	(
		{ center, zoom, selectedLocation, onLocationChange, onZoomChange },
		ref
	) => {
		return (
			<MapContainer
				center={center}
				zoom={zoom}
				ref={ref}
				style={{ height: '100%', width: '100%' }}
				zoomControl={true}
				minZoom={3}
				maxZoom={18}
				maxBounds={[
					[-90, -180],
					[90, 180],
				]}
				maxBoundsViscosity={1.0}
				worldCopyJump={true}
				scrollWheelZoom={true} // Enable smooth zoom based on cursor position
				zoomSnap={0.25} // Adjust the zoom snapping to make zoom smoother
				zoomDelta={0.5} // Smaller steps for zoom to give smoother experience
				wheelPxPerZoomLevel={120} // Control zoom based on scroll wheel intensity
			>
				<MapContent
					center={center}
					zoom={zoom}
					selectedLocation={selectedLocation}
					onLocationChange={onLocationChange}
					onZoomChange={onZoomChange}
				/>
			</MapContainer>
		);
	}
);

export default Map;
