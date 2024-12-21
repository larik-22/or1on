<script lang="ts">
    import { onMount } from "svelte";
    import page from "page";
    import TourWindow from "../lib/components/tours/TourWindow.svelte";

    let tours = null;

    /**
     * Fetches tours from the backend
     */
    const fetchRoutes = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours`);
        const data = await response.json();
        tours = data.tours;
    };

    /**
     * Handles navigation to a specific tour's page
     */
    const handleRouteSelect = (event) => {
        const tourID = event.detail;
        page.redirect(`/tours/${tourID}`); //Change to the tour page later
    };

    onMount(fetchRoutes);
</script>

<div class="w-full h-screen flex flex-col bg-gray-100 p-4">
    {#if tours?.length > 0}
        <TourWindow tours={tours} on:select={handleRouteSelect} />
    {:else}
        <p class="text-center text-gray-500">Loading tours...</p>
    {/if}
</div>
