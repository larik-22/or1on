<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    // Define interfaces to match current backend state
    interface Tour {
        id: number;
        name: string;
        description: string;
        category?: string;
        duration_time?: string;
        start_hour?: string;
    }

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
</script>

{#if enabled_popup}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-96 max-w-full">
            <h2 class="text-xl font-bold mb-4">{tour.id ? 'Edit Tour' : 'Add Tour'}</h2>
            <label class="block mb-2">
                Name:
                <input
                        type="text"
                        bind:value={tour.name}
                        class="w-full p-2 mt-1 border border-gray-300 rounded"
                        required
                />
            </label>
            <label class="block mb-2">
                Description:
                <textarea
                        bind:value={tour.description}
                        class="w-full p-2 mt-1 border border-gray-300 rounded"
                        required
                ></textarea>
            </label>
            <label class="block mb-2">
                Category:
                <input
                        type="text"
                        bind:value={tour.category}
                        class="w-full p-2 mt-1 border border-gray-300 rounded"
                />
            </label>
            <label class="block mb-2">
                Duration Time:
                <input
                        type="text"
                        bind:value={tour.duration_time}
                        class="w-full p-2 mt-1 border border-gray-300 rounded"
                />
            </label>
            <label class="block mb-4">
                Start Hour:
                <input
                        type="text"
                        bind:value={tour.start_hour}
                        class="w-full p-2 mt-1 border border-gray-300 rounded"
                />
            </label>
            <div class="flex justify-between">
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