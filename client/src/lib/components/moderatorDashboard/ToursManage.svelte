<script lang="ts">
    import TourPopUp from "./TourPopUp.svelte";
    import Table, { type TableType, type Row } from '../table/Table.svelte';
    import { onMount } from 'svelte';

    interface Highlight {
        id: number;
        name: string;
        description?: string;
        category?: string;
    }

    interface Tour {
        id: number;
        name: string;
        description?: string;
        category: string;
        duration_time?: string;
        start_hour?: string;
        highlights: Highlight[];
    }

    let enabled_popup: boolean = false;
    let currentTour: Tour = {
        id: 0,
        name: "",
        description: "",
        category: "",
        duration_time: "",
        start_hour: "",
        highlights: []
    };

    let tours: Tour[] = [];

    let newTable: TableType = {
        columns: ["Name", "Description", "Category", "Duration", "Start Time", "ID", "Highlights"],
        rows: []
    };

    function formatHighlights(highlights: Highlight[]): string {
        if (!highlights || !Array.isArray(highlights) || highlights.length === 0) {
            return 'No highlights';
        }
        return highlights.map(h => h.name).join(', ');
    }

    async function fetchTours() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.tours && Array.isArray(data.tours)) {
                    tours = data.tours.map(tour => ({
                        ...tour,
                        category: tour.category || "",
                        duration_time: tour.duration_time || "",
                        start_hour: tour.start_hour || "",
                        highlights: Array.isArray(tour.highlights?.getItems)
                            ? tour.highlights.getItems()
                            : Array.isArray(tour.highlights)
                                ? tour.highlights
                                : []
                    }));

                    newTable.rows = tours.map(tour => ({
                        row: [
                            tour.name || '',
                            tour.description || '',
                            tour.category || '',
                            tour.duration_time || '',
                            tour.start_hour || '',
                            tour.id?.toString() || '',
                            formatHighlights(tour.highlights) // Format highlights for display
                        ],
                        actionsVisibility: [true, true]
                    }));
                } else {
                    tours = [];
                    newTable.rows = [];
                    console.error('No tours data received');
                }
            } else {
                console.error('Failed to fetch tours');
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            tours = [];
            newTable.rows = [];
        }
    }

    onMount(() => {
        fetchTours();
    });

    function addTour() {
        currentTour = {
            id: 0,
            name: "",
            description: "",
            category: "",
            duration_time: "",
            start_hour: "",
            highlights: []
        };
        enabled_popup = true;
    }

    function deleteTour(row: Row) {
        const id = parseInt(row.row[5]);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/tours/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            if (response.ok) {
                tours = tours.filter(tour => tour.id !== id);
                newTable.rows = newTable.rows.filter(r => r.row[5] !== id.toString());
            } else {
                console.error('Failed to delete tour');
            }
        }).catch(error => {
            console.error('Error deleting tour:', error);
        });
    }

    function editTour(row: Row) {
        const id = parseInt(row.row[5]);
        const tour = tours.find(tour => tour.id === id);
        if (tour) {
            currentTour = { ...tour };
            enabled_popup = true;
        }
    }

    function saveTour(event: CustomEvent<Tour>) {
        const tour = event.detail;
        const method = tour.id ? 'PUT' : 'POST';
        const url = tour.id
            ? `${import.meta.env.VITE_BACKEND_URL}/tours/${tour.id}`
            : `${import.meta.env.VITE_BACKEND_URL}/tours`;

        // Format the tour data according to your backend expectations
        const tourData = {
            name: tour.name,
            description: tour.description || null,
            category: tour.category,
            duration_time: tour.duration_time || null,
            start_hour: tour.start_hour || null,
            highlights: tour.highlights.map(h => h.id) // Send only the highlight IDs
        };

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(tourData)
        }).then(async response => {
            if (response.ok) {
                enabled_popup = false;
                await fetchTours();
            } else {
                console.error('Failed to save tour');
            }
        }).catch(error => {
            console.error('Error saving tour:', error);
        });
    }
</script>

<main class="flex items-center justify-center w-full min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg w-4/5 mb-10 p-6">
        <Table
                {newTable}
                actionsSlot={true}
                actionConfigs={[
                {
                    actionName: 'Edit',
                    actionFunction: editTour,
                    actionClassStyle: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                },
                {
                    actionName: 'Delete',
                    actionFunction: deleteTour,
                    actionClassStyle: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                }
            ]}
        />
        <div class="flex justify-center mt-4">
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" on:click={addTour}>
                Add Tour
            </button>
        </div>
    </div>

    {#if enabled_popup}
        <TourPopUp
                bind:enabled_popup
                tour={currentTour}
                on:save={saveTour}
        />
    {/if}
</main>

<style>
    main {
        font-family: 'Arial', sans-serif;
    }
</style>