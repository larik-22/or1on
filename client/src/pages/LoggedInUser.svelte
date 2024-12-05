<script lang="ts">
	import {fetchWithAuthSvelte} from "../lib/utils/fetchWithAuth.svelte";

	const testFetch = async () => {
		try {
			const response = await fetchWithAuthSvelte(`${import.meta.env.VITE_BACKEND_URL}/test/protected`,)
		} catch (e) {
			console.error(e);
		}
	}

	testFetch();
</script>

<h1>
	Only for authenticated users... Make a protected fetch call
</h1>