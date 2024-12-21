<script>
    import { createEventDispatcher } from "svelte";

    export let tours = [];
    const dispatch = createEventDispatcher();

    const formatDuration = (duration) => {
        const { hours, minutes } = duration;
        return `${hours}h ${minutes}m`;
    };

    const handleClick = (id) => {
        dispatch("select", id); // Dispatch 'select' event with the tour ID
    };
</script>

<div class="w-4/5 bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Tour Viewer</h2>

    {#if tours.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each tours as tour (tour.id)}
                <div
                        class="tour-card p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
                        on:click={() => handleClick(tour.id)}
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
        <p class="text-center text-gray-500">No tours available.</p>
    {/if}
</div>
