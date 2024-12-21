<script lang="ts">
    import { onMount } from "svelte";
    import page from "page";
    import TourWindow from "../lib/components/tours/TourWindow.svelte"; // Adjust the path as needed

    let tours = null;

    /**
     * Fetches tours from the backend
     */
    const fetchRoutes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours`);
            if (!response.ok) {
                throw new Error(`Failed to fetch tours: ${response.statusText}`);
            }
            const data = await response.json();
            tours = data.tours; // Extract tours array directly
            console.log("Fetched tours:", tours);
        } catch (error) {
            console.error("Error fetching tours:", error);
            tours = null; // Ensure `tours` is null in case of an error
        }
    };

    /**
     * Handles navigation to a specific tour's page
     */
    const handleRouteSelect = (event) => {
        const tourID = event.detail;
        page.redirect(`/test`);
    };

    onMount(fetchRoutes);
</script>

<div class="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
    {#if tours?.length > 0}
        <TourWindow tours={tours} on:select={handleRouteSelect} />
    {:else}
        <p class="text-center text-gray-500">Loading tours...</p>
    {/if}
</div>
