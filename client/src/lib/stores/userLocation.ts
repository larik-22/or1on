import {writable} from "svelte/store";
import {getUserLocation} from "../utils/mapUtils.svelte";
import type {LatLng} from "leaflet";

export const userLocation = writable<LatLng | null>(null);

getUserLocation().then((location) => {
	userLocation.set(location);
}).catch(() => {
	// fallback to last saved location in localStorage
	const lastLocation = localStorage.getItem("userLocation");
	if (lastLocation) {
		userLocation.set(JSON.parse(lastLocation));
	}
});


