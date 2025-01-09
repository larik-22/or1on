import {getHighlightColor} from "./highlightTypeColor";
import type {HighlightFeature} from "../models/models";
import {modals} from "svelte-modals";
import HighlightModal from "../components/highlights/HighlightModal.svelte";
import L from "leaflet";
import type SMap from "sveaflet/dist/SMap.svelte";

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
		highlightId: feature.properties.id
	})
}


/**
 * Gets the user location. Returns a promise that resolves with the location or rejects with an error
 */
export const getUserLocation = (): Promise<L.LatLng> => {
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
 * Displays the user location on the map and zooms to it
 * @param map The map to display the location on
 * @param latlng The location to display
 */
export const displayUserLocation = (map: SMap, latlng: L.LatLng) => {
	map.setView(latlng, 15);

	const marker = L.marker(latlng, {
		icon: L.icon({
			iconUrl: "/images/user-icon.svg",
			iconSize: [30, 30],
			iconAnchor: [15, 15],
			popupAnchor: [0, -15]
		})
	});

	marker.addTo(map);
}