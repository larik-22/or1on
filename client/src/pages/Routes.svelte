<script lang="ts">
    import {onMount} from "svelte";
    import type {FeatureCollection} from "geojson";
    import page from "page";

    let routes: FeatureCollection | null = $state(null);

    /**
     * Fetches the Routes from the backend
     */
    const fetchRoutes = async () => {
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours`);
        routes = await data.json();
    }

    /**
     * Handles navigation to a specific route's page
     */
    const handleRouteSelect = (routeId: string) => {
        page.redirect(`/routes/${routeId}`);
    };

    onMount(fetchRoutes);
</script>

<div class="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
    <div class="w-4/5 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Route Viewer</h2>

        {#if routes}
            <div class="grid grid-cols-2 gap-4">
                {#each routes.features as route (route.id)}
                    <div
                            class="p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-sm hover:bg-blue-200 cursor-pointer"
                            on:click={() => handleRouteSelect(route.id)}
                    >
                        <h3 class="text-sm font-bold text-blue-800 mb-2">Route ID: {route.id}</h3>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-center text-gray-500">Loading routes...</p>
        {/if}
    </div>
</div>