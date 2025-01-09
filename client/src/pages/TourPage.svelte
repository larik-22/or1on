<script lang="ts">
	// check if exists, otherwise redirect to 404
	// if exists display map and tour details
	import page, {type Context} from "page";
	import {Control, ControlZoom, GeoJSON, Map, TileLayer} from "sveaflet";
	import type SMap from "sveaflet/dist/SMap.svelte";
	import type {FeatureCollection} from "geojson";
	import type SGeoJson from "sveaflet/dist/SGeoJSON.svelte";
	import L, {LatLng} from "leaflet";
	import {HighlightType, type Tour} from "../lib/models/models";
	import {onMount} from "svelte";
	import FilterDropdown from "../lib/components/highlights/FilterDropdown.svelte";
	import {displayUserLocation, getMapMarker} from "../lib/utils/mapUtils.svelte";
	import {userLocation} from "../lib/stores/userLocation";

	let context: Context = $props();
	let tourId: number = context.params.params.id;

	let tourData: Tour | null = $state(null);
	let tourGeoJSON: FeatureCollection | null = $state(null);
	let geoJSONElement: SGeoJson | null = $state(null);
	let map: SMap | null = $state(null);

	async function fetchTourData(id: number): Promise<void> {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours/${id}`);
		const data = await response.json();

		if (!response.ok) {
			page.redirect("/")
		}

		tourData = data as Tour;
	};

	async function fetchTourGeoJSON(id: number): Promise<void> {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours/${id}/map/highlights`);
		const data = await response.json();

		if (!response.ok) {
			page.redirect("/")
		}

		tourGeoJSON = data?.geoJSON as FeatureCollection;
	};

	onMount(() => {
		fetchTourData(tourId);
		fetchTourGeoJSON(tourId);

		$inspect($userLocation);
		$effect(() => {
			if($userLocation){
				displayUserLocation(map, $userLocation);
			}
		})
	});

</script>

<div class="w-full" style="height: 100svh">
	<Map
			bind:instance={map}
			options={{
				center: [52.254298, 6.168155],
				zoom: 13.5,
				closePopupOnClick: true,
				zoomControl: false,
			}}>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}/>
		{#if tourGeoJSON}
			<GeoJSON
					json={tourGeoJSON}
					options={{pointToLayer: getMapMarker}}
					bind:instance={geoJSONElement}
			>
			</GeoJSON>
			<ControlZoom options={{position:"bottomleft"}}></ControlZoom>
		{/if}
	</Map>
</div>