<script lang="ts">
	import {HighlightType} from "../lib/models/models";
	import {modals} from "svelte-modals";
	import SuggestHighlightModal from "../lib/components/highlights/SuggestHighlightModal.svelte";

	type HighlightForm = {
		lat: number,
		lng: number,
		name: string,
		description: string,
		category: HighlightType
	}

	let selectedLocation: L.LatLng | undefined = $state(undefined);
	let highlightPayload: HighlightForm = $state({
		lat: 0,
		lng: 0,
		name: "",
		description: "",
		category: HighlightType.CATEGORY_A
	})
	let validated: boolean = $state(false);

	$effect(() => {
		highlightPayload.lat = selectedLocation?.lat || 0;
		highlightPayload.lng = selectedLocation?.lng || 0;

	})

	/**
	 * Opens a popup or clears location selection
	 */
	const handleButtonClick = async () => {
		if (selectedLocation) {
			selectedLocation = undefined;
		} else {
			selectedLocation = await modals.open(SuggestHighlightModal, {selectedLocation});
		}
	}


</script>
<div class="w-full h-svh flex flex-col justify-center items-center">
	<form aria-labelledby="form-title" class="min-w-[500px] mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
		<h2 class="text-xl font-bold text-gray-800" id="form-title">Submit Highlight</h2>

		<div>
			<label class="block text-sm font-medium text-gray-700" for="highlight-location">
				Location <span aria-hidden="true" class="text-red-400">*</span>
			</label>

			<!-- Dynamic Button -->
			<button aria-label={selectedLocation ? "Reset selected location" : "Select a location on the map"}
					class={`mt-1 flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left
							${selectedLocation ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-white text-gray-700 hover:bg-gray-100"}
							focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors`}
					id="highlight-location"
					onclick={handleButtonClick}
					type="button">

				<span class="flex items-center">
					<svg class={`h-5 w-5 mr-2 ${selectedLocation ? "text-indigo-700" : "text-indigo-500"}`}
						 fill="none"
						 stroke="currentColor"
						 viewBox="0 0 24 24"
						 xmlns="http://www.w3.org/2000/svg"
					>
					   <path
							   d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 10.1046 13.1046 11 12 11Z"
							   stroke-linecap="round"
							   stroke-linejoin="round"
							   stroke-width="2"
					   />
         			</svg>
					<span id="selected-location">
						{selectedLocation ? `Location selected: ${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}` : "Select location on map"}
					</span>
				</span>
				{#if selectedLocation}
					<svg
							class="h-5 w-5 text-gray-500 hover:text-gray-700 ml-2"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				{/if}
			</button>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-700" for="highlight-name">
				Name <span aria-hidden="true" class="text-red-400">*</span>
			</label>
			<input
					aria-required="true"
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					id="highlight-name"
					name="highlight-name"
					placeholder="Hogeschool Saxion - Deventer"
					required
					type="text"
					bind:value={highlightPayload.name}
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700" for="highlight-description">
				Description <span aria-hidden="true" class="text-red-400">*</span>
			</label>
			<textarea
					aria-required="true"
					class="min-h-16 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					id="highlight-description"
					name="highlight-description"
					placeholder="Saxion University of Applied Sciences is a Dutch university of applied sciences with three campuses in the eastern Netherlands."
					required
					bind:value={highlightPayload.description}
			></textarea>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700" for="highlight-category">
				Category <span aria-hidden="true" class="text-red-400">*</span>
			</label>
			<select
					aria-required="true"
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
					id="highlight-category"
					name="highlight-category"
					required
					bind:value={highlightPayload.category}
			>
				{#each Object.values(HighlightType) as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>

		<div>
			<button
					aria-label="Submit form"
					class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
					type="submit"
			>
				Submit
			</button>
		</div>
	</form>
</div>
