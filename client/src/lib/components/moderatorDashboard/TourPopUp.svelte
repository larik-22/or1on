<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Tour, Highlight } from '../../models/models';

    export let enabled_popup: boolean;
    export let tour: Tour;

    const dispatch = createEventDispatcher();

    function save() {
        dispatch('save', tour);
        enabled_popup = false;
    }

    function close() {
        enabled_popup = false;
    }

    function handleHighlightsInput(e: Event) {
        const input = (e.target as HTMLInputElement).value;
        tour.highlights = input.split(',')
            .filter(name => name.trim())
            .map(name => ({
                id: Date.now() + Math.random(), // Ensure unique IDs
                name: name.trim()
            }));
    }
</script>

{#if enabled_popup}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-96 max-w-full">
            <h2 class="text-xl font-bold mb-4">{tour.id ? 'Edit Tour' : 'Add Tour'}</h2>
            <label class="block mb-2">
                Name:
                <input type="text" bind:value={tour.name} class="w-full p-2 mt-1 border border-gray-300 rounded" />
            </label>
            <label class="block mb-2">
                Description:
                <textarea bind:value={tour.description} class="w-full p-2 mt-1 border border-gray-300 rounded"></textarea>
            </label>
            <label class="block mb-4">
                Highlights (comma separated):
                <input
                        type="text"
                        value={tour.highlights.map(h => h.name).join(', ')}
                        on:input={handleHighlightsInput}
                        class="w-full p-2 mt-1 border border-gray-300 rounded"
                />
            </label>
            <div class="flex justify-between">
                <button on:click={save} class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                <button on:click={close} class="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
    </div>
{/if}