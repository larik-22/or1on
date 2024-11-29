<script lang="ts">
	import {fetchWithAuth} from "../utils/fetchWithAuth";

	const testFetch = async () => {
		try {
			const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/test/adminprotected`,)
		} catch (e) {
			console.error(e);
		}
	}

	testFetch();
</script>

<h1>
	Only for authenticated users... Make a protected fetch call
</h1>