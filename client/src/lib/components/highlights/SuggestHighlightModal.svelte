<script lang="ts">
	import type {ModalProps} from "svelte-modals";
	import {fade} from "svelte/transition";
	import L, {type LocationEvent} from "leaflet";
	import {ControlZoom, LayerGroup, Map, TileLayer} from "sveaflet";
	import type SMap from "sveaflet/dist/SMap.svelte";
	import type SLayerGroup from "sveaflet/dist/SLayerGroup.svelte";

	type CloseValue = L.LatLng | undefined;
	interface SuggestHighlightModalProps extends ModalProps<CloseValue> {
		selectedLocation: L.LatLng | undefined;
	}

	let {isOpen, selectedLocation, close}: SuggestHighlightModalProps = $props();
	let map: SMap | null = $state(null);
	let layerGroup: SLayerGroup | null = $state(null);

	const handleClose = () => {
		close(selectedLocation);
	}

	const saveLocation = (e: LocationEvent) => {
		selectedLocation = e.latlng;
	}

	const clearMarkers = () => {
		layerGroup?.clearLayers();
	}

	const displayLocation = (latlng: L.LatLng) => {
		if(!map || !latlng) return;

		const marker = new L.Marker(latlng);
		layerGroup?.addLayer(marker);
	}

	$effect(() => {
		if(map){
			displayLocation(selectedLocation);

			map.on('click', (e: LocationEvent) => {
				clearMarkers();
				saveLocation(e);
				displayLocation(e.latlng);
			})
		}
	})
</script>

{#if isOpen}
	<button
			type="button"
			class="fixed z-[999] inset-0"
			onclick={handleClose}
			aria-label="Close modal"
	></button>
	<div
			role="dialog"
			class="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md"
			transition:fade|global={{ duration: 300 }}
	>
		<!-- The Modal -->
		<div class="bg-white rounded-md shadow-lg w-full max-w-3xl pointer-events-auto max-h-[650px] p-4 border border-gray-400">
			<button
					aria-label="Close"
					class="absolute top-4 right-4 text-gray-200 hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 rounded-full p-2"
					onclick={handleClose}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div class="flex items-center space-x-2 bg-gray-100 rounded-md p-3 text-gray-700 mb-2 transition-colors duration-200" class:bg-green-200 = {selectedLocation}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" class:text-green-700={selectedLocation} viewBox="0 0 20 20" fill="currentColor">
					<path
							fill-rule="evenodd"
							d="M6.293 14.707a1 1 0 010-1.414L10.586 9 6.293 4.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
					/>
				</svg>
				<span>{selectedLocation ? "Your location is saved." : "Select a location by clicking on it. Your selection will be saved"}</span>
				{#if selectedLocation}
					<button
							class="text-green-900 underline"
							onclick={() => {
								selectedLocation = undefined;
								clearMarkers();
							}}
					>
						Clear
					</button>
				{/if}
			</div>
			<div class="h-[500px] w-full relative">
				<Map
						options={{
							center: [52.254298, 6.168155],
							zoom: 13.5,
							closePopupOnClick: true,
							zoomControl: false,
							maxBounds: [
								[52.194, 6.078],
								[52.314, 6.258],
							],
							maxBoundsViscosity: 1.0,
							minZoom: 12,
							maxZoom: 18,
                		}}
						bind:instance={map}
				>
					<LayerGroup bind:instance={layerGroup} />
					<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}/>
					<ControlZoom options={{ position: "bottomleft" }}></ControlZoom>
				</Map>
			</div>
		</div>
	</div>
{/if}
