<script lang="ts">
	import page, {type Context} from "page";
	import {Control, ControlZoom, GeoJSON, Map, TileLayer} from "sveaflet";
	//@ts-expect-error - This is available but still highlighted as error (idk why)
	import type SMap from "sveaflet/dist/SMap.svelte";
	import type {Feature, FeatureCollection} from "geojson";
	import L, {LatLng} from "leaflet";
	import {type Tour} from "../lib/models/models";
	import {onDestroy, onMount} from "svelte";
	import {getUserLocationMarker, getMapMarker} from "../lib/utils/mapUtils.svelte";
	import 'leaflet-routing-machine';
	import 'lrm-graphhopper';
	import {userLocation} from "../lib/stores/userLocation";

	let context: Context = $props();
	let tourId: number = context.params.params.id;

	let tourData: Tour | null = $state(null);
	let tourGeoJSON: FeatureCollection | null = $state(null);
	let map: SMap | null = $state(null);
	let routingControl: L.Routing.Control | null = $state(null);
	let watchId: number | null = $state(null);
	let recalculateIntervalId: number | null = $state(null);
	let userMarker: L.Marker | null = $state(null);

	/**
	 * Fetches the tour data from the backend
	 * If the fetch fails, redirect to the tours
	 * @param id - The id of the tour
	 */
	async function fetchTourData(id: number): Promise<void> {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours/${id}`);
			if (!response.ok) throw new Error("Failed to fetch tour data");
			const data = await response.json();
			tourData = data.tour as Tour;
		} catch (error) {
			console.error(error);
			page.redirect("/tours");
		}
	}

	/**
	 * Fetches the tour geoJSON data from the backend
	 * If the fetch fails, redirect to the tours
	 * @param id - The id of the tour
	 */
	async function fetchTourGeoJSON(id: number): Promise<void> {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours/${id}/map/highlights`);
			if (!response.ok) throw new Error("Failed to fetch geoJSON");
			const data = await response.json();
			tourGeoJSON = data?.geoJSON as FeatureCollection;
		} catch (error) {
			console.error(error);
			page.redirect("/tours");
		}
	}

	/**
	 * Calculates the distance between two points
	 * @param pointA - The first point
	 * @param pointB - The second point
	 */
	const calculateDistance = (pointA: LatLng, pointB: LatLng): number => {
		return pointA.distanceTo(pointB);
	};

	/**
	 * Generates a route by sorting points based on proximity
	 * @param userLocation - The user's location
	 * @param features - array of highlights
	 */
	const generateRoute = (userLocation: LatLng, features: Feature[]): LatLng[] => {
		const remainingPoints = features.map((feature) => {
			const [longitude, latitude] = feature.geometry.coordinates;
			return new LatLng(latitude, longitude);
		});

		const route = [userLocation];
		let lastPoint = userLocation;

		while (remainingPoints.length > 0) {
			let closestIndex = 0;
			let closestDistance = calculateDistance(lastPoint, remainingPoints[0]);

			for (let i = 1; i < remainingPoints.length; i++) {
				const distance = calculateDistance(lastPoint, remainingPoints[i]);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestIndex = i;
				}
			}

			const closestPoint = remainingPoints.splice(closestIndex, 1)[0];
			route.push(closestPoint);
			lastPoint = closestPoint;
		}

		return route;
	};

	/**
	 * Initializes the routing control and sets the waypoints
	 */
	const initializeRoute = (): void => {
		if (!userLocation) {
			alert("Could not get user location. Please enable location services.");
			return;
		}

		const route = generateRoute($userLocation, tourGeoJSON?.features || []);

		if (!routingControl) {
			routingControl = L.Routing.control({
				waypoints: [...route],
				routeWhileDragging: false,
				addWaypoints: false,
				router: L.Routing.graphHopper(
					`${import.meta.env.VITE_GRASSHOPER_API_KEY}`,
					{ urlParameters: { vehicle: "foot" } }
				),
				createMarker: () => null,
				lineOptions: {
					styles: [
						{
							color: "blue",
							opacity: 0.75,
							weight: 4.5,
							stroke: true,
							dashArray: "5, 10",
							lineCap: "round",
							lineJoin: "round",
						},
					],
				},
			}).addTo(map);
		} else {
			routingControl.setWaypoints([...route]);
		}
	};

	/**
	 * Watches the user's location and recalculates the route every 30 seconds
	 */
	const watchUserLocation = (): void => {
		const updateUserLocation = (position: GeolocationPosition): void => {
			const { latitude, longitude } = position.coords;
			$userLocation = new LatLng(latitude, longitude);
		};

		const handleError = (error: GeolocationPositionError): void => {
			console.error("Error getting location:", error.code);
		};

		watchId = navigator.geolocation.watchPosition(updateUserLocation, handleError, {
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 5000,
		});

		recalculateIntervalId = setInterval(() => {
			if ($userLocation && tourGeoJSON?.features) {
				const newRoute = generateRoute($userLocation, tourGeoJSON.features);
				routingControl?.setWaypoints([...newRoute]);
			}
		}, 30000);
	};

	/**
	 * Updates the user marker on the map
	 * @param location - The new location
	 */
	const updateUserMarker = (location: LatLng): void => {
		if (userMarker == null) {
			userMarker = getUserLocationMarker(location).addTo(map);
		} else {
			userMarker.setLatLng(location);
		}
	};

	/**
	 * Cleans up the watch and interval
	 */
	const cleanup = (): void => {
		if (watchId !== null) {
			navigator.geolocation.clearWatch(watchId);
			watchId = null;
		}
		if (recalculateIntervalId !== null) {
			clearInterval(recalculateIntervalId);
			recalculateIntervalId = null;
		}
	};

	onMount(async () => {
		await fetchTourData(tourId);
		await fetchTourGeoJSON(tourId);
		watchUserLocation();
		initializeRoute()

		// testing purposes only
		map?.on("click", (event: L.LeafletMouseEvent) => {
			$userLocation = event.latlng;
		});
	});

	onDestroy(() => {
		cleanup();
	});

	$effect(() => {
		if ($userLocation != null && map != null) {
			updateUserMarker($userLocation);
		}
	})
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"/>
</svelte:head>
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
		{#if tourGeoJSON && tourData}
			<Control options={{position:"topleft"}}>
				<div class="border-2 border-gray-400 bg-white p-3 rounded-lg shadow-md max-w-[300px]">
					<h2 class="text-md font-bold mb-1">{tourData.name}</h2>
					<p class="text-gray-700">{tourData.description}</p>
				</div>
			</Control>
			<GeoJSON
					json={tourGeoJSON}
					options={{pointToLayer: getMapMarker}}
			>
			</GeoJSON>
			<ControlZoom options={{position:"bottomleft"}}></ControlZoom>
		{/if}
	</Map>
</div>