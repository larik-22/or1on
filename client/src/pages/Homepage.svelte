<script lang="ts">
	import {Control, ControlZoom, GeoJSON, Map, TileLayer} from 'sveaflet';
	import L, {LatLng} from 'leaflet';
	import {modals} from 'svelte-modals'
	import type {FeatureCollection} from "geojson";
	import {type HighlightFeature, HighlightType} from "../lib/models/models";
	import {getHighlightColor} from "../lib/utils/highlightTypeColor";
	import type SMap from "sveaflet/dist/SMap.svelte";
	import type SGeoJson from "sveaflet/dist/SGeoJSON.svelte";
	import HighlightModal from "../lib/components/highlights/HighlightModal.svelte";
	import {onMount} from "svelte";
	import FilterDropdown from "../lib/components/highlights/FilterDropdown.svelte";
	import "leaflet.markercluster";

	let geoJSONData: FeatureCollection | null = $state(null);
	let geoJSONElement: SGeoJson | null = $state(null);
	let map: SMap | null = $state(null);
	let currentHighlightFilter: string[] = $state([]);
	let userLocation: LatLng | null = $state(null);
	let markerClusterGroup: L.MarkerClusterGroup = $state(L.markerClusterGroup({
		showCoverageOnHover: false,
		spiderfyOnMaxZoom: true,
		removeOutsideVisibleBounds: true,
		zoomToBoundsOnClick: true,
		iconCreateFunction: (cluster) => {
			const count = cluster.getChildCount();
			return L.divIcon({
				html: `<div>${count}</div>`,
				className: "custom-cluster-icon",
				iconSize: L.point(40, 40),
			});
		}
	}));

	onMount(() => {
		fetchGeoJSON();

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				userLocation = new L.LatLng(position.coords.latitude, position.coords.longitude);
			});
		}

		//Zoom to user location
		$effect(() => {
			if (userLocation) {
				//map?.setView(userLocation, 13);

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
	 * Handles the point to layer conversion
	 * @param feature
	 * @param latlng
	 */
	const handlePointToLayer = (feature: HighlightFeature, latlng: L.LatLng): L.Layer => {
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

		return markerClusterGroup.addLayer(marker);
	};

	/**
	 * Opens the modal with the highlight information
	 * @param feature The feature to show in the modal
	 */
	const openHighlightModal = async (feature: HighlightFeature) => {
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
	/**
	 * Applies the current filter to the GeoJSON data
	 */
	const applyFilter = () => {
		if (!geoJSONData) return;

		// Clear existing markers
		markerClusterGroup.clearLayers();

		// If no filter is applied, add all markers
		const filteredFeatures = currentHighlightFilter.length === 0
			? geoJSONData.features
			: geoJSONData.features.filter((feature): feature is HighlightFeature => {
				return feature.properties?.category && filterFeatures(feature as HighlightFeature);
			});

		// Add markers to the cluster
		addMarkersToCluster(filteredFeatures);

		// Re-add the cluster group to the map
		map?.addLayer(markerClusterGroup);
	};

	/**
	 * Adds the provided features as markers to the marker cluster group
	 * @param features - List of GeoJSON features to be added
	 */
	const addMarkersToCluster = (features: GeoJSON.Feature[]) => {
		features.forEach((feature) => {
			const latLng = L.latLng((feature.geometry as GeoJSON.Point).coordinates[1], (feature.geometry as GeoJSON.Point).coordinates[0]);
			const marker = handlePointToLayer(feature as HighlightFeature, latLng) as L.Marker;
			markerClusterGroup.addLayer(marker);
		});
	};
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
		{#if geoJSONData}
			<GeoJSON
					json={geoJSONData}
					options={{pointToLayer: handlePointToLayer}}
					bind:instance={geoJSONElement}
			>
			</GeoJSON>
			<Control options={{position:"topleft"}}>
				<FilterDropdown
						bind:currentFilter={currentHighlightFilter}
						applyFilter={applyFilter}
						filterOptions={Object.values(HighlightType)}
				></FilterDropdown>
			</Control>
			<ControlZoom options={{position:"bottomleft"}}></ControlZoom>
		{/if}
	</Map>
</div>


