<script lang="ts">
    import Table from "../table/Table.svelte";
    import WarningPopUp from "./WarningPopUp.svelte";
    import type { TableType, Row } from "../table/Table.svelte";
    import type { ActionConfig } from "../table/Action.svelte";

    // Sample suggestion data
    let suggestions = [
        {
            id: 1,
            name: "Suggestion 1",
            description: "Description of Suggestion 1",
            category: "Historical",
            suggestedBy: "User1 (ID: 101)"
        },
        {
            id: 2,
            name: "Suggestion 2",
            description: "Description of Suggestion 2",
            category: "Cultural",
            suggestedBy: "User2 (ID: 102)"
        },
        {
            id: 3,
            name: "Suggestion 3",
            description: "Description of Suggestion 3",
            category: "Modern",
            suggestedBy: "User3 (ID: 103)"
        }
    ];

    let currentRow: Row | null = null;
    let enabledPopup: boolean = $state(false);
    let popupText = "";
    let isAccepting = false;

    // Convert suggestions data to TableType
    function dataToTable(data: typeof suggestions): TableType {
        const columns = ["Name", "Description", "Category", "Suggested By"];
        const rows = data.map((suggestion) => ({
            row: [
                suggestion.name,
                suggestion.description,
                suggestion.category,
                suggestion.suggestedBy
            ],
            actionsVisibility: [true, true]
        }));
        return { columns, rows };
    }

    let newTable: TableType = $state(dataToTable(suggestions));

    // Style for buttons
    let acceptActionCss: string =
        "bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600";
    let rejectActionCss: string =
        "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600";

    // Accept suggestion
    let acceptActionConfig: ActionConfig = {
        actionName: "Accept",
        actionFunction: async (row: Row) => {
            currentRow = row;
            isAccepting = true;
            popupText = `Are you sure you want to accept the suggestion: "${row.row[0]}"?`;
            enabledPopup = true;
        },
        actionClassStyle: acceptActionCss
    };

    // Reject suggestion
    let rejectActionConfig: ActionConfig = {
        actionName: "Reject",
        actionFunction: async (row: Row) => {
            currentRow = row;
            isAccepting = false;
            popupText = `Are you sure you want to reject the suggestion: "${row.row[0]}"?`;
            enabledPopup = true;
        },
        actionClassStyle: rejectActionCss
    };

    // Confirm action function (accept or reject)
    function confirmAction() {
        if (currentRow) {
            const index = newTable.rows.findIndex((r) => r === currentRow);
            if (index > -1) {
                if (isAccepting) {
                    // add the accepted suggestion to highlights
                    console.log(`Accepted: ${currentRow.row[0]}`);
                } else {
                    // remove the rejected suggestion
                    newTable.rows.splice(index, 1);
                    console.log(`Rejected: ${currentRow.row[0]}`);
                }
            }
        }
        enabledPopup = false;
    }
</script>

<main class="flex flex-col items-center justify-center w-full h-full">
    <div class="bg-gray-50 shadow-md w-[90%] lg:w-[80%] p-6 rounded-lg">
        <h1 class="text-2xl font-semibold mb-6">Manage Suggestions</h1>

        <!-- Table of suggestions -->
        <Table newTable={newTable} actionConfigs={[acceptActionConfig, rejectActionConfig]} />

        <!-- confirmation popup -->
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
