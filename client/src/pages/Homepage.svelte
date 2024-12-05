<script lang="ts">
	import {Map, TileLayer, Circle, Popup, Marker, Icon, GeoJSON} from 'sveaflet';
	import L from 'leaflet';
	import HighlightModal from "../components/modals/HighlightModal.svelte";
	import { modals } from 'svelte-modals'

	const geoJSONMock = {
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [6.168155, 52.254298]
				},
				"properties": {
					"highlightType": "pub",
					"highlightName": "Deventer Pub",
					"highlightDescription": "A cozy pub in the city center.",
					"highlightId": "123sodkje223",
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [6.160031, 52.2515]
				},
				"properties": {
					"highlightType": "pub",
					"highlightName": "Another Pub",
					"highlightDescription": "A cozy pub in the city center.",
					"highlightId": "kjdlwj22320",
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [6.161126, 52.256801]
				},
				"properties": {
					"highlightType": "test",
					"highlightName": "Another Test",
					"highlightDescription": "A test marker",
					"highlightId": "idididdi22",
				}
			}
		]
	};

	// navigator.geolocation.getCurrentPosition((position) => {
	// 	userLocation = {
	// 		lat: position.coords.latitude,
	// 		lng: position.coords.longitude
	// 	};
	// });

	const openModal = async (feature) => {
		modals.open(HighlightModal, {
			highlightName: feature.properties.highlightName,
			highlightDescription: feature.properties.highlightDescription,
			highlightId: feature.properties.highlightId
		})

	}
</script>

<div class="w-full h-svh" >
	<Map options={{ center: [52.254298, 6.168155], zoom: 13, closePopupOnClick: true }}>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}/>
		<GeoJSON
				json={geoJSONMock}
				options={{
					pointToLayer: (feature, latlng) => {
						let color;
						switch (feature.properties.highlightType){
							case "pub": {
								color = "yellow";
								break;
							}
							case "test": {
								color = "red";
								break;
							}
							default: {
								color = "green"
								break;
							}
						}
						return L.circleMarker(latlng, {
							color: color || feature.properties.color,
							fillColor: color || feature.properties.color,
							fillOpacity: 0.5
						});
					},
					onEachFeature: (feature, layer) => {
						layer.on('click', (e) => {
							openModal(feature)
						});
					}
				}}
		>

		</GeoJSON>
	</Map>
</div>


