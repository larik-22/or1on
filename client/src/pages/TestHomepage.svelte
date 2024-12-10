<script lang="ts">
    import {GeoJSON, Map, TileLayer} from 'sveaflet';
    import L, {LatLng, Layer} from 'leaflet';
    import HighlightModal from "../components/highlights/HighlightModal.svelte";
    import {modals} from 'svelte-modals'
    import {fetchWithAuthSvelte} from "../lib/utils/fetchWithAuth.svelte";
    import type {Feature, GeoJsonObject} from "geojson";
    import type {HighlightFeature} from "../lib/models/models";
    import {getHighlightColor} from "../lib/utils/highlightTypes";


    let geoJSONData: GeoJsonObject | null = $state(null);


    /**
     * Fetches the GeoJSON data from the backend
     */
    const fetchGeoJSON = async () => {
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/map/highlights`);
        geoJSONData = await data.json() as GeoJsonObject;
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

    fetchGeoJSON();


</script>

<div class="w-full" style="height: 100svh">
    <Map options={{ center: [52.254298, 6.168155], zoom: 13, closePopupOnClick: true }}>
        <TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}/>
        {#if geoJSONData}
            <GeoJSON
                    json={geoJSONData}
                    options={
					{
						onEachFeature: handleEachFeature,
						pointToLayer: handlePointToLayer,
						// filter: handleHighlightFilter
					}
				}
            >
            </GeoJSON>
        {/if}
    </Map>
</div>