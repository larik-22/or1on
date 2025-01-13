<script lang="ts">
    import FilterDropdown from "../highlights/FilterDropdown.svelte";

    const { myHighlights, onSelect } = $props<{
        myHighlights: any[],
        onSelect: (id: string) => void
    }>();

    let currentFilter: string[] = $state([]);

    /**
     * Filter formation options
     */
    const filterOptions = $derived.by(() => {
        const categories = myHighlights
            .map((highlight) => highlight.is_approved)
            .filter((category): category is boolean => category !== undefined);

        // Map true/false to "Approved"/"Pending"
        return Array.from(new Set(categories)).map((value) =>
            value ? "Approved" : "Pending"
        );
    });

    /**
     * Filters the tours based on the active filters
     */
    const applyFilter = (): any[] => {
        return currentFilter.length === 0
            ? myHighlights // show all if no filter
            : myHighlights.filter((highlight) =>
                currentFilter.includes(highlight.is_approved ? "Approved" : "Pending")
            );
    };
</script>

<div class="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">My Highlights</h2>
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
            {#each applyFilter() as highlight }
                <button
                        onclick={() => onSelect(highlight.id)}
                        class="flex justify-stretch items-stretch"
                >
                    <div class="bg-white py-4 px-3 mb-4 rounded-lg shadow-md w-[80%] max-w-lg flex flex-col justify-start text-left min-h-[12rem]">
                        <h3 class="text-xl font-semibold text-gray-800">{highlight.name}</h3>
                        <p class="text-sm text-gray-600">{highlight.description}</p>
                        <p class="text-sm text-gray-500">Category: {highlight.category}</p>
                        <p class="text-sm text-gray-500">Business Info: {highlight.businessDescription}</p>
                        <p class="text-sm mt-auto">
                            Status:
                            {#if highlight.is_approved}
                                <span class="text-green-500">Approved</span>
                            {:else}
                                <span class="text-yellow-500">Pending</span>
                            {/if}
                        </p>
                    </div>
                </button>
            {/each}
        </div>
    {:else}
        <p class="text-center text-gray-500">No highlights match your filter criteria.</p>
    {/if}
</div>
