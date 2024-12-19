<script lang="ts">
	import {Control, ControlZoom, GeoJSON, Map, TileLayer} from 'sveaflet';
	import L, {LatLng, Layer} from 'leaflet';
	import {modals} from 'svelte-modals'
	import type {FeatureCollection} from "geojson";
	import {type HighlightFeature, type HighlightProperties, HighlightType} from "../lib/models/models";
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
	const markerClusterGroup: L.MarkerClusterGroup = $state(L.markerClusterGroup({
		showCoverageOnHover: true,
		spiderfyOnMaxZoom: true,
		removeOutsideVisibleBounds: true,
		zoomToBoundsOnClick: true,

		iconCreateFunction: (cluster) => {
			const count = cluster.getChildCount();
			return L.divIcon({
				html: `<div class="cluster-icon">${count}</div>`,
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

		geoJSONData?.features.forEach((feature) => {
			const latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
			const marker = handlePointToLayer(feature, latlng) as L.Marker;
			marker.on('click', () => openHighlightModal(feature)); // Open modal on marker click
			markerClusterGroup.addLayer(marker);
		});

		geoJSONElement?.clearLayers();
		map?.addLayer(markerClusterGroup);
	}

	/**
	 * Handles popup opening when clicking on each highlight
	 * @param feature
	 * @param layer
	 */
	const handleEachFeature = (feature: HighlightFeature, layer: Layer) => {
		layer.on('click', (e) => {
			openHighlightModal(feature)
		});
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

		// Add hover and click interactivity
		marker.on("mouseover", () => {
			marker.setStyle({
				radius: radius * 1.2,
				fillOpacity: 0.9
			});
		});
		marker.on("mouseout", () => {
			marker.setStyle({
				radius,
				fillOpacity: 0.7
			});
		});

		// Add a tooltip with feature name
		if (feature.properties.name) {
			marker.bindTooltip(feature.properties.name, {
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
	const applyFilter = () => {
		if (geoJSONData) {
			if (currentHighlightFilter.length === 0) {
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
					options={
					{
						onEachFeature: handleEachFeature,
						pointToLayer: handlePointToLayer,
					}
				}
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


