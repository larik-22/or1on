<script lang="ts">
    import { GeoJSON, Map, TileLayer } from 'sveaflet';
    import L, { LatLng, Layer } from 'leaflet';
    import 'leaflet-routing-machine';
    import 'lrm-graphhopper';
    import { onMount } from 'svelte';
    import type { Feature, GeoJsonObject } from "geojson";
    import HighlightModal from "../components/highlights/HighlightModal.svelte";
    import { modals } from 'svelte-modals';
    import type { HighlightFeature } from "../lib/models/models";
    import { getHighlightColor } from "../lib/utils/highlightTypes";

    let geoJSONData: GeoJsonObject | null = null;
    let map: L.Map | null = null; // Reference to the Leaflet map instance
    let userLocation: LatLng | null = null;

    /**
     * Fetches the GeoJSON data from the backend
     */
    const fetchGeoJSON = async () => {
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/map/highlights`);
        geoJSONData = await data.json() as GeoJsonObject;
        plotRouteToPoints();
    };

    /**
     * Get user location (mocked for now)
     * Replace this with Geolocation API for real user locations
     */
    const getUserLocation = () => {
        userLocation = new LatLng(52.257868775720844, 6.149507746684932); // Mocked user location
    };

    /**
     * Plots a route between the user location and the points of interest
     * Uses the OSRM routing service to calculate the route
     */
    const plotRouteToPoints = () => {
        if (!map || !userLocation || !geoJSONData) return;

        const features = (geoJSONData as any).features as Feature[];

        // Convert GeoJSON features to LatLng objects and pair with their names
        const waypoints = features.map((feature) => {
            const [longitude, latitude] = feature.geometry.coordinates;
            return {
                latLng: new LatLng(latitude, longitude),
                name: feature.properties.name || "Unknown"
            };
        });

        // Sort waypoints by distance from the previous point
        const sortedWaypoints = [{ latLng: userLocation, name: "User Location" }];
        let currentLocation = userLocation;

        while (waypoints.length > 0) {
            waypoints.sort((a, b) => currentLocation.distanceTo(a.latLng) - currentLocation.distanceTo(b.latLng));
            const closestPoint = waypoints.shift();
            if (closestPoint) {
                sortedWaypoints.push(closestPoint);
                currentLocation = closestPoint.latLng;
            }
        }

        // Log the names and distances between the points in a single log
        const logOutput = sortedWaypoints.slice(1).map((point, index) => {
            const previousPoint = sortedWaypoints[index];
            const distance = previousPoint.latLng.distanceTo(point.latLng);
            return `${previousPoint.name} to ${point.name}: ${distance.toFixed(2)} meters`;
        }).join("\n");

        console.log("Points and distances:\n" + logOutput);

        // Create a routing control
        L.Routing.control({
            waypoints: sortedWaypoints.map((point) => point.latLng),
            routeWhileDragging: true,
            show: true, // Show route control UI
            addWaypoints: false, // Prevent adding/moving waypoints dynamically
            router: L.Routing.graphHopper(
                '',
                {
                    urlParameters:{
                        vehicle: 'foot'
                    }
                }
            ),
            createMarker: () => null // Don’t create markers for the waypoints
        }).addTo(map);
    };

    /**
     * Handles popup opening when clicking on each highlight
     * @param feature
     * @param layer
     */
    const handleEachFeature = (feature: HighlightFeature, layer: Layer) => {
        layer.on('click', () => {
            openModal(feature);
        });
    };

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
    };

    /**
     * Opens the modal with the highlight information
     * @param feature The feature to show in the modal
     */
    const openModal = async (feature: HighlightFeature) => {
        await modals.open(HighlightModal, {
            name: feature.properties.name,
            description: feature.properties.description,
            id: feature.properties.id
        });
    };

    /**
     * Fetches the GeoJSON data from the backend
     */
    onMount(() => {
        getUserLocation();
        fetchGeoJSON();
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
    <script src="leaflet-routing-machine.js"></script>
    <script src="lrm-graphhopper.js"></script>
</svelte:head>

<div class="w-full" style="height: 100svh">
    <Map options={{ center: [52.254298, 6.168155], zoom: 13, closePopupOnClick: true }} bind:instance={map}>
        <TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
        {#if geoJSONData}
            <GeoJSON
                json={geoJSONData}
                options={{
                    onEachFeature: handleEachFeature,
                    pointToLayer: handlePointToLayer
                }}
            />
        {/if}
    </Map>
</div>