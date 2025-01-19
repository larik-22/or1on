<script lang="ts">
	import MyHighlightWindow from "../lib/components/myHighlights/MyHighlightWindow.svelte";
	import {fetchWithAuthSvelte} from "../lib/utils/fetchWithAuth.svelte";

	// Fetch user highlights
	const fetchUserHighlights = async (): Promise<any[]> => {
		const response = await fetchWithAuthSvelte(`${import.meta.env.VITE_BACKEND_URL}/highlights/my-highlights`);
		if (!response.ok) {
			throw new Error("Failed to fetch user highlights");
		}
		const data = await response.json();
		return data.highlights as Highlight[];
	};

</script>


<div class="w-full h-screen flex justify-center items-center bg-gray-100">
	{#await fetchUserHighlights()}
		<p class="text-center text-gray-500">Loading your highlights...</p>
	{:then data}
		<MyHighlightWindow myHighlights={data}/>
	{:catch error}
		<p class="text-center text-red-500">Failed to load your highlights: {error.message}</p>
	{/await}
</div>
