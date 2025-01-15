<script lang="ts">
    import Table from "../table/Table.svelte";
    import WarningPopUp from "./WarningPopUp.svelte";
    import type { TableType, Row } from "../table/Table.svelte";
    import type { ActionConfig } from "../table/Action.svelte";
    import {onMount} from "svelte";

    const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/highlights`;


    // State variables
    let suggestions: Suggestion[] = $state([]);
    let newTable: TableType = $state({ columns: [], rows: [] });
    let currentRow: Row | null = $state(null);
    let enabledPopup: boolean = $state(false);
    let popupText: string = $state("");
    let isAccepting: boolean = $state(false);

    // Suggestion Type Definition
    type Suggestion = {
        id: number;
        name: string;
        description: string;
        category: string;
        latitude: number | null;
        longitude: number | null;
        is_approved: boolean;
        businessDescription: string | null;
        suggestedBy?: { username: string };
    };

    // Fetch suggestions from the backend
    async function fetchSuggestions() {
        try {
            const response = await fetch(API_BASE, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // type fetch data
            const data: { highlights: Suggestion[] } = await response.json();

            // filter highlights with correct type
            suggestions = (data.highlights || []).filter((highlight: Suggestion) => !highlight.is_approved);
            newTable = dataToTable(suggestions);
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        }
    }

    // Convert suggestions to TableType
    function dataToTable(data: Suggestion[]) {
        data.sort((a, b) => a.id - b.id); // sort highlights by id in ascending order

        const columns = [
            "ID",
            "Name",
            "Description",
            "Business Description",
            "Category",
            "Latitude",
            "Longitude",
            "Suggested By",
            "Approved State",
        ];
        const rows = data.map((highlight) => ({
            row: [
                highlight.id.toString(),
                highlight.name,
                highlight.description,
                highlight.businessDescription || "none",
                highlight.category,
                highlight.latitude?.toFixed(6) || "N/A",
                highlight.longitude?.toFixed(6) || "N/A",
                highlight.suggestedBy?.username || "Unknown",
                highlight.is_approved ? "Approved" : "Pending",
            ],
            actionsVisibility: [true, true],
        }));
        return { columns, rows };
    }

    // Approve a suggestion
    async function approveSuggestion(row: Row) {
        const id = parseInt(row.row[0]);
        try {
            const response = await fetch(`${API_BASE}/${id}/approve`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                console.log(`Approved suggestion ID: ${id}`);
                await fetchSuggestions(); // refresh
            } else {
                console.error(`Failed to approve suggestion ID: ${id}`);
            }
        } catch (error) {
            console.error("Error approving suggestion:", error);
        }
    }

    // Reject a suggestion
    async function rejectSuggestion(row: Row) {
        const id = parseInt(row.row[0]);
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                console.log(`Rejected suggestion ID: ${id}`);
                await fetchSuggestions(); // Refresh data
            } else {
                console.error(`Failed to reject suggestion ID: ${id}`);
            }
        } catch (error) {
            console.error("Error rejecting suggestion:", error);
        }
    }

    // Accept action
    let acceptActionConfig: ActionConfig = {
        actionName: "Accept",
        actionFunction: (row) => {
            currentRow = row;
            isAccepting = true;
            popupText = `Are you sure you want to accept the suggestion: "${row.row[1]}"?`;
            enabledPopup = true;
        },
        actionClassStyle: "bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600",
    };

    // Reject action
    let rejectActionConfig: ActionConfig = {
        actionName: "Reject",
        actionFunction: (row) => {
            currentRow = row;
            isAccepting = false;
            popupText = `Are you sure you want to reject the suggestion: "${row.row[1]}"?`;
            enabledPopup = true;
        },
        actionClassStyle: "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600",
    };

    // Confirm action
    function confirmAction() {
        if (currentRow) {
            if (isAccepting) {
                approveSuggestion(currentRow);
            } else {
                rejectSuggestion(currentRow);
            }
        }
        enabledPopup = false;
    }

    // Fetch suggestions on mount
    onMount(() => {
        fetchSuggestions();
    });

</script>

<main class="flex flex-col items-center justify-center w-full h-full">
    <div class="bg-gray-50 shadow-md w-[90%] lg:w-[80%] p-6 rounded-lg">
        <h1 class="text-2xl font-semibold mb-6">Manage Suggestions</h1>
        <hr class="border-t-2 border-gray-200 mb-6" />

        <!-- Table of suggestions -->
        <Table newTable={newTable} actionConfigs={[acceptActionConfig, rejectActionConfig]} />

        <!-- Confirmation popup -->
        {#if enabledPopup}
            <WarningPopUp
                    bind:enabled_popup={enabledPopup}
                    popupText={popupText}
                    onConfirmFunction={confirmAction}
            />
        {/if}
    </div>
</main>

<style>
    main {
        height: 100vh;
        background-color: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bg-gray-50 {
        box-sizing: border-box;
    }
</style>