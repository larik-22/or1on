import {writable} from "svelte/store";
import {getUserLocation} from "../utils/mapUtils.svelte";
import type {LatLng} from "leaflet";

export const userLocation = writable<LatLng | null>(null);

getUserLocation().then((location) => {
	userLocation.set(location);
}).catch(() => {
	userLocation.set(null);
});