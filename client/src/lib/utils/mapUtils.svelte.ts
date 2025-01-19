import {getHighlightColor} from "./highlightTypeColor";
import type {HighlightFeature} from "../models/models";
import {modals} from "svelte-modals";
import HighlightModal from "../components/highlights/HighlightModal.svelte";
import L from "leaflet";

/**
 * Handles the point to layer conversion
 * @param feature
 * @param latlng
 */
export const getMapMarker = (feature: HighlightFeature, latlng: L.LatLng): L.CircleMarker => {
	const color = getHighlightColor(feature.properties.category);
	const radius = 8;

	const marker = L.circleMarker(latlng, {
		radius,
		fillColor: color,
		color: "#333",
		weight: 1.5,
		opacity: 0.8,
		fillOpacity: 0.7,
	});

	marker.on("mouseover", () => {
		marker.setStyle({
			radius: radius * 1.2,
			fillOpacity: 0.8,
		});
	});

	marker.on("mouseout", () => {
		marker.setStyle({
			radius,
			fillOpacity: 0.7
		});
	});

	marker.on('click', () => openHighlightModal(feature));

	if (feature.properties.name) {
		marker.bindTooltip(`<strong>${feature.properties.name}</strong><br>Click to see more information`, {
			permanent: false,
			direction: "top",
			className: "custom-tooltip"
		});
	}

	return marker;
};

/**
 * Opens the modal with the highlight information
 * @param feature The feature to show in the modal
 */
export const openHighlightModal = async (feature: HighlightFeature) => {
	await modals.open(HighlightModal, {
		name: feature.properties.name,
		description: feature.properties.description,
		highlightId: feature.properties.id,
		businessDescription: feature.properties.businessDescription,
	})
}


/**
 * Gets the user location. Returns a promise that resolves with the location or rejects with an error
 */
export function getUserLocation  (): Promise<L.LatLng> {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition((position) => {
			const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
			resolve(latlng);
		}, (error) => {
			reject(error);
		});
	});
}

/**
 * Gets a marker for the user location
 * @param latlng The location to display
 */
export const getUserLocationMarker = (latlng: L.LatLng) => {
	const cssIcon = L.divIcon({
		className: 'css-icon',
		html: `
            <div class="gps_ring"></div>
            <div class="static_circle"></div>
        `,
		iconSize: [22, 22]
		// ,iconAnchor: [11,11]
	});

	// Create a marker with the icon
	const marker = L.marker(latlng, {
		icon: cssIcon
	});

	marker.bindPopup("You are here");

	return marker;
};
