<script lang="ts">
    import WarningPopUp from "./WarningPopUp.svelte";
    import TourPopUp from "./TourPopUp.svelte";
    import Table, { type TableType, type Row } from '../table/Table.svelte';
    import type { Tour } from '../../models/models';
    import { onMount } from 'svelte';

    let enabled_popup: boolean = false;
    let currentTour: Tour = { id: 0, name: "", description: "", highlights: [] };
    let tours: Tour[] = [];
    let tableData: TableType = { columns: ["Name", "Description", "ID", "Highlights"], rows: [] };

    async function fetchTours() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tours`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                tours = await response.json();
                tableData.rows = tours.map(tour => ({
                    row: [tour.name, tour.description, tour.id.toString(), tour.highlights.join(", ")],
                    actionsVisibility: [true, true, true]
                }));
            } else {
                console.error('Failed to fetch tours');
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
    }

    onMount(() => {
        fetchTours();
    });

    function addTour() {
        currentTour = { id: Date.now(), name: "", description: "", highlights: [] };
        enabled_popup = true;
    }

    function deleteTour(id: number) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/tours/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            if (response.ok) {
                tours = tours.filter(tour => tour.id !== id);
                tableData.rows = tableData.rows.filter(row => row.row[2] !== id.toString());
            } else {
                console.error('Failed to delete tour');
            }
        }).catch(error => {
            console.error('Error deleting tour:', error);
        });
    }

    function editTour(id: number) {
        const tour = tours.find(tour => tour.id === id);
        if (tour) {
            currentTour = { ...tour };
            enabled_popup = true;
        }
    }

    function saveTour(tour: Tour) {
        const method = tour.id ? 'PUT' : 'POST';
        const url = tour.id ? `${import.meta.env.VITE_BACKEND_URL}/tours/${tour.id}` : `${import.meta.env.VITE_BACKEND_URL}/tours`;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(tour)
        }).then(response => {
            if (response.ok) {
                if (method === 'POST') {
                    tours = [...tours, tour];
                } else {
                    const index = tours.findIndex(t => t.id === tour.id);
                    if (index > -1) {
                        tours[index] = tour;
                    }
                }
                tableData.rows = tours.map(tour => ({
                    row: [tour.name, tour.description, tour.id.toString(), tour.highlights.join(", ")],
                    actionsVisibility: [true, true, true]
                }));
                enabled_popup = false;
            } else {
                console.error('Failed to save tour');
            }
        }).catch(error => {
            console.error('Error saving tour:', error);
        });
    }

    let newTable: TableType = {
        columns: ["Name", "Description", "ID", "Highlights"],
        rows: []
    };
</script>

<main class="flex items-center justify-center w-full min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg w-4/5 mb-10 p-6">
        <Table {newTable} actionsSlot={true} actionConfigs={[
            { actionName: 'Edit', actionFunction: (row: Row) => editTour(parseInt(row.row[2])) },
            { actionName: 'Delete', actionFunction: (row: Row) => deleteTour(parseInt(row.row[2])) }
        ]}/>
        <div class="flex justify-center mt-4">
            <button class="bg-green-500 text-white px-4 py-2 rounded" on:click={addTour}>Add Tour</button>
        </div>
    </div>

    <TourPopUp bind:enabled_popup={enabled_popup} tour={currentTour} on:save={(e) => saveTour(e.detail)}/>
</main>

<style>
    main {
        font-family: 'Arial', sans-serif;
    }
</style>