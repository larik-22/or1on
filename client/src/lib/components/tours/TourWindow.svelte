    };

    };
</script>


                <div
                        class="tour-card p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
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
    {/if}
</div>
