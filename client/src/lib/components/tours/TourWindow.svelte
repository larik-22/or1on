<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import FilterDropdown from "../highlights/FilterDropdown.svelte";

    export let tours = [];
    const dispatch = createEventDispatcher();

    let filterOptions: string[] = [];
    let currentFilter: string[] = [];

    $: {
        // Extract unique categories for the filter dropdown
        const categories = tours
            .map((tour) => tour.category)
            .filter((category): category is string => category !== undefined);
        filterOptions = Array.from(new Set(categories));
    }

    /**
     * Filters the tours based on the active filters
     */
    const applyFilter = (): Tour[] => {
        return currentFilter.length === 0
            ? tours // Show all tours if no filter is selected
            : tours.filter((tour) => currentFilter.includes(tour.category));
    };

    /**
     * Formats the duration time as a string
     */
    const formatDuration = (duration: { hours: number; minutes: number }): string => {
        return `${duration.hours}h ${duration.minutes}m`;
    };
</script>

<div class="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
    <!-- Header with Filter Button -->
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Tour Viewer</h2>

        <!-- Filter Dropdown -->
        <div class="flex-shrink-0">
            <FilterDropdown
                    bind:currentFilter={currentFilter}
                    applyFilter={applyFilter}
                    filterOptions={filterOptions}
            />
        </div>
    </div>

    {#if applyFilter().length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style="max-height: 34rem; overflow-y: auto;">
            {#each applyFilter() as tour (tour.id)}
                <div
                        class="tour-card p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
                        on:click={() => dispatch('select', tour.id)}
                >
                    <h3 class="text-lg font-bold text-gray-800 mb-2">{tour.name}</h3>
                    <p class="text-sm text-gray-600 mb-1">
                        <span class="font-semibold">Category:</span> {tour.category}
                    </p>
                    <p class="text-sm text-gray-600 mb-1">
                        <span class="font-semibold">Description:</span> {tour.description}
                    </p>
                    <p class="text-sm text-gray-600 mb-1">
                        <span class="font-semibold">Duration:</span> {formatDuration(tour.duration_time)}
                    </p>
                    <p class="text-sm text-gray-600">
                        <span class="font-semibold">Start Time:</span> {tour.start_hour}
                    </p>
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-center text-gray-500">No tours match your filter criteria.</p>
    {/if}
</div>
