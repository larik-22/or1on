<script lang="ts">
	import {Control, ControlZoom, GeoJSON, Map, TileLayer} from 'sveaflet';
	import L, {LatLng} from 'leaflet';
	import type {FeatureCollection} from "geojson";
	import {type HighlightFeature, HighlightType} from "../lib/models/models";
	import type SMap from "sveaflet/dist/SMap.svelte";
	import type SGeoJson from "sveaflet/dist/SGeoJSON.svelte";
	import {onMount} from "svelte";
	import FilterDropdown from "../lib/components/highlights/FilterDropdown.svelte";
	import "leaflet.markercluster";
	import {getMapMarker, getUserLocation, getUserLocationMarker} from "../lib/utils/mapUtils.svelte";
	import {userLocation} from "../lib/stores/userLocation";

	let geoJSONData: FeatureCollection | null = $state(null);
	let geoJSONElement: SGeoJson | null = $state(null);
	let map: SMap | null = $state(null);
	let currentHighlightFilter: string[] = $state([]);
	let loc: LatLng | null = $state($userLocation);

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

		getUserLocation().then((location) => {
			loc = location;
		}).catch(() => {
			loc = null;
		});

		//Zoom to user location
		$effect(() => {
			if (loc != null) {
				map?.addLayer(getUserLocationMarker(loc));
				map.setView(loc, 15);
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
		const marker: L.CircleMarker = getMapMarker(feature, latlng);
		return markerClusterGroup.addLayer(marker);
	};

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


