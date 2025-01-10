<script lang="ts">
    import FilterDropdown from "../highlights/FilterDropdown.svelte";

    const {tours, onSelect} = $props<{
        tours: any[],
        onSelect: (id: string) => void
    }>();

    let currentFilter: string[] = $state([]);

    /**
     * Filter formation options
     */
    const filterOptions = $derived.by(() => {
        const categories = tours
            .map((tour) => tour.category)
            .filter((category): category is string => category !== undefined);
        return Array.from(new Set(categories));
    });

    /**
     * Filters the tours based on the active filters
     */
    const applyFilter = (): any[] => {
        return currentFilter.length === 0
            ? tours // show all if no filter
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
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Tour Viewer</h2>
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
                <button
                        onclick={() => onSelect(tour.id)}
                >
                    <div class="bg-white p-4 mb-4 rounded-lg shadow-md w-full max-w-lg">
                        <h3 class="text-xl font-semibold text-gray-800">{tour.name}</h3>
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
                </button>
            {/each}
        </div>
    {:else}
        <p class="text-center text-gray-500">No tours match your filter criteria.</p>
    {/if}
</div>