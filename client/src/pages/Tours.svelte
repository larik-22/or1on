<script lang="ts">
    import page from "page";
    import TourWindow from "../lib/components/tours/TourWindow.svelte";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
     * @param id The selected tour ID
     */
    const handleRouteSelect = (id: string): void => {
        page.redirect(`/tours/${id}`); //Change to the tour page later
    };
</script>

<div class="w-full h-screen flex justify-center items-center bg-gray-100">
    {#await fetchRoutes()}
        <p class="text-center text-gray-500">Loading tours...</p>
    {:then data}
        <TourWindow tours={data} onSelect={handleRouteSelect} />
    {:catch error}
        <p class="text-center text-red-500">Failed to load tours: {error.message}</p>
    {/await}
</div>
