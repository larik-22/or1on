<script lang="ts">
    import { onMount } from "svelte";
    import page from "page";


    /**
     * Fetches tours from the backend
     */
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours`);
            if (!response.ok) {
            }
            const data = await response.json();
    };

    /**
     * Handles navigation to a specific tour's page
     */
    };
</script>

        <p class="text-center text-gray-500">Loading tours...</p>
</div>
