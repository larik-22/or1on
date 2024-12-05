<script lang="ts">
	import {fetchWithAuthSvelte} from "../lib/utils/fetchWithAuth.svelte";

	const testFetch = async () => {
		try {
			const response = await fetchWithAuthSvelte(`${import.meta.env.VITE_BACKEND_URL}/test/adminprotected`,)
		} catch (e) {
			console.error(e);
		}
	}

	testFetch();
</script>
<h1>
	Only for admins... Make a fetch protected call
</h1>