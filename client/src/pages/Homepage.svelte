<script lang="ts">
	import {CircleMarker, GeoJSON, Map, TileLayer} from 'sveaflet';
	import L, {LatLng, Layer} from 'leaflet';
	import {modals} from 'svelte-modals'
	import type {FeatureCollection} from "geojson";
	import {type HighlightFeature, type HighlightProperties, HighlightType} from "../lib/models/models";
	import {getHighlightColor} from "../lib/utils/highlightTypeColor";
	import type SMap from "sveaflet/dist/SMap.svelte";
	import type SGeoJson from "sveaflet/dist/SGeoJSON.svelte";
	import HighlightModal from "../lib/components/highlights/HighlightModal.svelte";
	import {onMount} from "svelte";


	let geoJSONData: FeatureCollection | null = $state(null);
	let geoJSONElement: SGeoJson | null = $state(null);
	let map: SMap | null = $state(null);
	let currentHighlightFilter: string = $state("All");
	let userLocation: LatLng | null = $state(null);

	onMount(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				userLocation = new L.LatLng(position.coords.latitude, position.coords.longitude);
			});
		}

		// Zoom to user location
		$effect(() => {
			if (userLocation) {
				map?.setView(userLocation, 13);

				// Add user location marker
				const userMarker = new L.Marker(userLocation);
				userMarker.addTo(map);
			}
		})
	});

	/**
	 * Fetches the GeoJSON data from the backend
	 */
	const fetchGeoJSON = async () => {
		const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/map/highlights`);
		geoJSONData = await data.json() as FeatureCollection;
	}

	/**
	 * Handles popup opening when clicking on each highlight
	 * @param feature
	 * @param layer
	 */
	const handleEachFeature = (feature: HighlightFeature, layer: Layer) => {
		layer.on('click', (e) => {
			openModal(feature)
		});
	}

	/**
	 * Handles the point to layer conversion
	 * @param feature
	 * @param latlng
	 */
	const handlePointToLayer = (feature: HighlightFeature, latlng: LatLng): Layer => {
		const color = getHighlightColor(feature.properties.category);

		return new L.CircleMarker(latlng, {
			radius: 8,
			fillColor: color,
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.5
		});
	}

	/**
	 * Opens the modal with the highlight information
	 * @param feature The feature to show in the modal
	 */
	const openModal = async (feature: HighlightFeature) => {
		await modals.open(HighlightModal, {
			name: feature.properties.name,
			description: feature.properties.description,
			id: feature.properties.id
		})
	}

	/**
	 * Filters the GeoJSON features based on the current filter
	 */
	const filterFeatures = (feature: HighlightFeature) => {
		if (feature.properties) {
			// Only include features matching the current filter
			return currentHighlightFilter.includes(feature.properties.category);
		}
		return false;
	}

	/**
	 * Applies the current filter to the GeoJSON data
	 */
	const applyFilter = () => {
		if (geoJSONData) {
			if (currentHighlightFilter === "All") {
				geoJSONElement.clearLayers();
				geoJSONElement.addData(geoJSONData);
				return;
			}

			const filteredGeoJSON: FeatureCollection = {
				type: "FeatureCollection",
				features: geoJSONData.features.filter((feature): feature is HighlightFeature => {
					return (feature.properties as HighlightProperties)?.category !== undefined && filterFeatures(feature as HighlightFeature);
				}),
			};

			geoJSONElement.clearLayers();
			geoJSONElement.addData(filteredGeoJSON);
		}
	};

	fetchGeoJSON();
</script>

<div class="w-full" style="height: 100svh">
	<Map options={{ center: [52.254298, 6.168155], zoom: 13, closePopupOnClick: true }} bind:instance={map}>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}/>
		{#if geoJSONData}
			<GeoJSON
					json={geoJSONData}
					options={
					{
						onEachFeature: handleEachFeature,
						pointToLayer: handlePointToLayer,
					}
				}
					bind:instance={geoJSONElement}
			>
			</GeoJSON>
		{/if}
	</Map>

	<div class="absolute top-4 right-4 z-[900] flex gap-2 shadow-xl">
		{#if currentHighlightFilter !== "All"}
			<button
					class="bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
					onclick={() => {
        				currentHighlightFilter = "All";
        				applyFilter();
      		}}>
				Clear
			</button>
		{/if}
		<select
				class="bg-gray-100 border border-gray-300 text-gray-600 py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
				bind:value={currentHighlightFilter}
				onchange={applyFilter}
		>
			<option value="All" class="text-gray-600" disabled selected>
				Select a category
			</option>
			{#each Object.values(HighlightType) as type}
				<option value={type}>{type}</option>
			{/each}
		</select>
	</div>
</div>



