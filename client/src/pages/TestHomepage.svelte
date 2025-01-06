<script lang="ts">
    import {GeoJSON, Map, TileLayer} from 'sveaflet';
    import L, {LatLng, Layer} from 'leaflet';
    import HighlightModal from '../lib/components/highlights/HighlightModal.svelte';
    import type {HighlightFeature} from "../lib/models/models";
    import type {Feature, GeoJsonObject} from "geojson";
    import 'leaflet-routing-machine';
    import 'lrm-graphhopper';
    import {getHighlightColor} from "../lib/utils/highlightTypeColor";
    import {onMount} from 'svelte';
    import {modals} from 'svelte-modals';

    let geoJSONData: GeoJsonObject | null = $state(null);
    let map: L.Map | null = $state(null);
    let userMarker: L.Marker | null = $state(null); // Marker for user location
    let routingControl: L.Routing.Control | null = $state(null); // Routing control
    let walkedPath: L.Polyline | null = $state(null); // Polyline for walked path

    const testUserWalking: LatLng[] = [
        new LatLng(52.24314250202436, 6.1663437509753),
        new LatLng(52.243261572130336, 6.1665194356693895),
        new LatLng(52.243455368309334, 6.166805090935352),
        new LatLng(52.24360564188758, 6.1670317375984105),
        new LatLng(52.24384788510506, 6.16738176587869),
        new LatLng(52.24407534617743, 6.167710336483489),
        new LatLng(52.24416074642155, 6.167821648159896),
        new LatLng(52.24423629266234, 6.167990627329244),
        new LatLng(52.24433729449001, 6.167943688670518),
        new LatLng(52.24438738474203, 6.1679289365206325),
        new LatLng(52.24440298661225, 6.1679262543115625),

        new LatLng(52.24445307679374, 6.167927595415602),
        new LatLng(52.24463208713117, 6.167979898492468),
        new LatLng(52.24474047836058, 6.168017449419448),
        new LatLng(52.244883357308254, 6.168059023658713),
        new LatLng(52.245096853726324, 6.168118032255991),

        new LatLng(52.24575704384784, 6.168190451893498),
        new LatLng(52.24585968446518, 6.168171676430033),
        new LatLng(52.24605182705912, 6.168140831026277),
        new LatLng(52.24618074277826, 6.168122055562348),
        new LatLng(52.24634414496345, 6.168128761085023),
    ];

    let currentStep = 0; // Track the current step in the user's path
    let movementInterval: number | null = null;

    /**
     * Fetches the GeoJSON data from the backend
     */
    const fetchGeoJSON = async () => {
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/map/highlights`);
        geoJSONData = await data.json() as GeoJsonObject;
    };

    /**
     * Initializes the user marker, walked path, and routing control
     */
    const initializeMapElements = () => {
        if (!map || !geoJSONData) return;

        // Initialize user marker
        const initialLocation = testUserWalking[0];
        userMarker = L.marker(initialLocation).addTo(map);

        // Initialize walked path polyline
        walkedPath = L.polyline([initialLocation], {
            color: 'green',
            weight: 3,
            opacity: 0.85,
        }).addTo(map);

        // Initialize routing control
        const features = (geoJSONData as any).features as Feature[];
        const waypoints = features.map((feature) => {
            const [longitude, latitude] = feature.geometry.coordinates;
            return {
                latLng: new LatLng(latitude, longitude),
                name: feature.properties.name || "Unknown"
            };
        });

        routingControl = L.Routing.control({
            waypoints: [initialLocation, ...waypoints],
            routeWhileDragging: false,
            addWaypoints: false,
            router: L.Routing.graphHopper(
                `${import.meta.env.VITE_GRASSHOPER_API_KEY}`,
                {urlParameters: {vehicle: 'foot'}}
            ),
            createMarker: () => null // Don’t create markers for waypoints
        }).addTo(map);
    };

    /**
     * Simulates user movement and updates location, walked path, and route dynamically
     */
    const simulateUserMovement = () => {
        if (!map || !userMarker || !routingControl || !walkedPath) return;

        movementInterval = setInterval(() => {
            if (currentStep >= testUserWalking.length) {
                clearInterval(movementInterval);
                return;
            }

            const newLocation = testUserWalking[currentStep];

            // Update user marker position
            userMarker.setLatLng(newLocation);

            // Update walked path
            walkedPath.addLatLng(newLocation);

            // Update routing control waypoints
            const newWaypoints = routingControl.getWaypoints();
            newWaypoints[0].latLng = newLocation; // Update the first waypoint to the new user location
            routingControl.setWaypoints(newWaypoints.map(wp => wp.latLng));

            currentStep++;
        }, 1000); // Update every second
    };

    /**
     * Handles popup opening when clicking on each highlight
     */
    const handleEachFeature = (feature: HighlightFeature, layer: Layer) => {
        layer.on('click', () => {
            openModal(feature);
        });
    };

    /**
     * Handles the point to layer conversion
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
     */
    const openModal = async (feature: HighlightFeature) => {
        await modals.open(HighlightModal, {
            name: feature.properties.name,
            description: feature.properties.description,
            id: feature.properties.id
        });
    };

    onMount(() => {
        fetchGeoJSON().then(() => {
            initializeMapElements();
            simulateUserMovement();
        });
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"/>
    <script src="leaflet-routing-machine.js"></script>
    <script src="lrm-graphhopper.js"></script>
</svelte:head>

<div class="w-full" style="height: 100svh">
    <Map options={{ center: [52.254298, 6.168155], zoom: 13, closePopupOnClick: true }} bind:instance={map}>
        <TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}/>
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