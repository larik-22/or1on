<script lang="ts">
    import { onMount } from "svelte";
    import page from "page";
    import TourWindow from "../lib/components/tours/TourWindow.svelte";

    let tours: any[] | undefined = $state(undefined);

    /**
     * Fetches tours from the backend
     * @returns A promise resolving to the tours array
     */
    const fetchRoutes = async (): Promise<any[]> => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours`);
        if (!response.ok) {
            throw new Error("Failed to fetch tours");
        }
        const data = await response.json();
        return data.tours || [];
    };

    /**
     * Handles navigation to a specific tour's page
     * @param event The event containing the selected tour ID
     */
    const handleRouteSelect = (event: CustomEvent<string>): void => {
        const tourID = event.detail;
        page.redirect(`/tours/${tourID}`); //Change to the tour page later
    };

    onMount(() => {
        fetchRoutes()
            .then((data) => (tours = data))
            .catch((error) => {
                console.error("Error fetching tours:", error);
                tours = [];
            });
    });
</script>

<div class="w-full h-screen flex flex-col bg-gray-100 p-4">
    {#if tours === undefined}
        <p class="text-center text-gray-500">Loading tours...</p>
    {:else if tours.length > 0}
        <TourWindow tours={tours} on:select={handleRouteSelect} />
    {:else}
        <p class="text-center text-gray-500">No tours available</p>
    {/if}
</div>
