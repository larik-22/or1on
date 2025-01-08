<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';

    interface Highlight {
        id: number;
        name: string;
        description?: string;
        category?: string;
    }

    interface Tour {
        id: number;
        name: string;
        description: string;
        category?: string;
        duration_time?: string;
        start_hour?: string;
        highlights: Highlight[];
    }

    export let enabled_popup: boolean;
    export let tour: Tour;

    let availableHighlights: Highlight[] = [];
    // Initialize the Set immediately to prevent undefined errors
    let selectedHighlightIds: Set<number> = new Set(tour.highlights?.map(h => h.id) || []);
    let filterCategory: string = '';
    let loading: boolean = true;
    let error: string = '';

    const dispatch = createEventDispatcher();

    onMount(async () => {
        await fetchHighlights();
    });

    async function fetchHighlights() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/highlights`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                availableHighlights = data.highlights || [];
            } else {
                error = 'Failed to fetch highlights';
            }
        } catch (err) {
            error = 'Error loading highlights';
            console.error('Error fetching highlights:', err);
        } finally {
            loading = false;
        }
    }

    function toggleHighlight(highlightId: number) {
        if (selectedHighlightIds.has(highlightId)) {
            selectedHighlightIds.delete(highlightId);
        } else {
            selectedHighlightIds.add(highlightId);
        }
        selectedHighlightIds = selectedHighlightIds; // Trigger reactivity

        // Update tour.highlights based on selection
        tour.highlights = availableHighlights.filter(h => selectedHighlightIds.has(h.id));
    }

    function getUniqueCategories(): string[] {
        const categories = new Set(availableHighlights.map(h => h.category).filter(Boolean));
        return Array.from(categories);
    }

    function getFilteredHighlights(): Highlight[] {
        if (!filterCategory) return availableHighlights;
        return availableHighlights.filter(h => h.category === filterCategory);
    }

    function save() {
        dispatch('save', tour);
        enabled_popup = false;
    }

    function close() {
        enabled_popup = false;
    }
</script>

{#if enabled_popup}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-[32rem] max-w-full max-h-[90vh] overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">{tour.id ? 'Edit Tour' : 'Add Tour'}</h2>

            <!-- Tour Details -->
            <div class="space-y-4 mb-6">
                <label class="block">
                    Name:
                    <input
                            type="text"
                            bind:value={tour.name}
                            class="w-full p-2 mt-1 border border-gray-300 rounded"
                            required
                    />
                </label>
                <label class="block">
                    Description:
                    <textarea
                            bind:value={tour.description}
                            class="w-full p-2 mt-1 border border-gray-300 rounded"
                            required
                    ></textarea>
                </label>
                <label class="block">
                    Category:
                    <input
                            type="text"
                            bind:value={tour.category}
                            class="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                </label>
                <label class="block">
                    Duration Time:
                    <input
                            type="time"
                            bind:value={tour.duration_time}
                            class="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                </label>
                <label class="block">
                    Start Hour:
                    <input
                            type="time"
                            bind:value={tour.start_hour}
                            class="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                </label>
            </div>

            <!-- Highlights Section -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Highlights</h3>

                {#if loading}
                    <p class="text-gray-600">Loading highlights...</p>
                {:else if error}
                    <p class="text-red-500">{error}</p>
                {:else}
                    <!-- Category Filter -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Filter by Category:</label>
                        <select
                                bind:value={filterCategory}
                                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="">All Categories</option>
                            {#each getUniqueCategories() as category}
                                <option value={category}>{category}</option>
                            {/each}
                        </select>
                    </div>

                    <!-- Highlights List -->
                    <div class="max-h-60 overflow-y-auto border rounded-md p-2">
                        {#each getFilteredHighlights() as highlight (highlight.id)}
                            <div class="flex items-center p-2 hover:bg-gray-50">
                                <input
                                        type="checkbox"
                                        id={`highlight-${highlight.id}`}
                                        checked={selectedHighlightIds.has(highlight.id)}
                                        on:change={() => toggleHighlight(highlight.id)}
                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label for={`highlight-${highlight.id}`} class="ml-2 block text-sm text-gray-900">
                                    {highlight.name}
                                    {#if highlight.category}
                                        <span class="text-xs text-gray-500 ml-2">({highlight.category})</span>
                                    {/if}
                                </label>
                            </div>
                        {/each}
                    </div>

                    <!-- Selected Highlights Summary -->
                    <div class="mt-2 text-sm text-gray-600">
                        Selected: {selectedHighlightIds.size} highlights
                    </div>
                {/if}
            </div>

            <!-- Actions -->
            <div class="flex justify-between mt-6">
                <button
                        on:click={save}
                        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Save
                </button>
                <button
                        on:click={close}
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}