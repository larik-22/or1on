<script lang="ts">
  /* eslint-disable  */
  import Table from "../table/Table.svelte";
  import WarningPopUp from "./WarningPopUp.svelte";
  import EditTextField from "./EditTextField.svelte";
  import type { TableType, Row } from "../table/Table.svelte";
  import type { ActionConfig } from "../table/Action.svelte";

  let highlights = [
    { id: 1, name: "Highlight 1", description: "Description of Highlight 1", category: "Demure" },
    { id: 2, name: "Highlight 2", description: "Description of Highlight 2", category: "Mindful" },
    { id: 3, name: "Highlight 3", description: "Description of Highlight 3", category: "What color is the sky" },
    { id: 4, name: "Highlight 4", description: "Description of Highlight 4", category: "FreakyAAh" },

  ]

  let currentRow: Row | null = null;
  let enabledPopup: boolean = $state(false);
  let editPopup: boolean = $state(false);
  let editValue: string = $state("");
  let addPopup: boolean = $state(false);
 // let newHighlight = { id: 0, name: "", description: "", category: "" };

  // Reactive properties for adding a new highlight
  let newName = $state("");
  let newDescription = $state("");
  let newCategory = $state("");

  // to convert highlights data to TableType
  function dataToTable(data: typeof highlights): TableType {
    const columns = ["Id", "Name", "Description", "Category"];
    const rows = data.map((highlight) => ({
      row: [highlight.id.toString(), highlight.name, highlight.description, highlight.category],
      actionsVisibility: [true, true, true] //show all actions by defaultt
    }));
    return { columns, rows };
  }

  let newTable: TableType = $state(dataToTable(highlights));
  // let customCss: string = "border-transparent w-[100%] h-[100%]";

  //delete highlight
  let deleteActionConfig: ActionConfig = {
    actionName: "Delete",
    actionFunction: async (row: Row) => {
      currentRow = row;
      enabledPopup = true;
    },
    actionClassStyle: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
  };

  //edit highlight
  let editActionConfig: ActionConfig = {
    actionName: "Edit",
    actionFunction: async (row: Row) => {
      currentRow = row;
      editValue = row.row[1]; //assuming the second column is the editable field (name)
      editPopup = true;
    },
    actionClassStyle:  "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
  };

  //confirm delete highlight function
  function confirmDelete() {
    if (currentRow) {
      const index = newTable.rows.findIndex((r) => r === currentRow);
      if (index > -1) {
        newTable.rows.splice(index, 1);
      }
    }
    enabledPopup = false;
  }

  // Confirm edit highlight function
  function confirmEdit(newText: string) {
    if (currentRow) {
      const index = newTable.rows.findIndex((r) => r === currentRow);
      if (index > -1) {
        newTable.rows[index].row[1] = newText; // Update the name field
      }
    }
    editPopup = false;
  }

  // Add highlight
  function addHighlight() {
    if (!newName || !newDescription || !newCategory) {
      alert("Please fill all fields!");
      return;
    }

    const newId = newTable.rows.length + 1; // Generate a new unique ID
    newTable = {
      ...newTable,
      rows: [
        ...newTable.rows,
        {
          row: [newId.toString(), newName, newDescription, newCategory],
          actionsVisibility: [true, true, true], // Show all actions
        },
      ],
    };

    // Clear the input fields
    newName = "";
    newDescription = "";
    newCategory = "";

    // Close the popup
    addPopup = false;
  }
</script>

<main class="flex flex-col items-center justify-center w-full h-full">
  <div class="bg-gray-50 shadow-md w-[90%] lg:w-[80%] p-6 rounded-lg">
    <div class="flex justify-end mb-4">
      <button
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onclick={() => (addPopup = true)}
      >
        Add Highlight
      </button>
    </div>

    <!-- Table component displaying highlights -->
    <Table newTable={newTable} actionConfigs={[deleteActionConfig, editActionConfig]} />

    <!-- Delete confirmation popup -->
    {#if enabledPopup}
      <WarningPopUp
              bind:enabled_popup={enabledPopup}
              popupText="Are you sure you want to delete this highlight?"
              onConfirmFunction={confirmDelete}
      />
    {/if}


    <!-- Add highlight popup -->
    {#if addPopup}
      <div class="popup-wrapper">
        <div class="popup-overlay" onclick={() => (addPopup = false)}></div>
        <div class="bg-white p-6 rounded shadow-md">
          <h2 class="text-lg font-semibold mb-4">Add New Highlight</h2>
          <div class="mb-4">
            <label class="block mb-2 font-medium">Name</label>
            <input type="text" bind:value={newName} class="w-full border px-2 py-1 rounded" />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-medium">Description</label>
            <textarea bind:value={newDescription} class="w-full border px-2 py-1 rounded"></textarea>
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-medium">Category</label>
            <input type="text" bind:value={newCategory} class="w-full border px-2 py-1 rounded" />
          </div>
          <div class="flex justify-end gap-4">
            <button
                    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onclick={() => (addPopup = false)}
            >
              Cancel
            </button>
            <button
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onclick={addHighlight}
            >
              Add
            </button>
          </div>
        </div>
      </div>
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

  /* Centering the popups */
  .popup-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
  }

  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.03);
    z-index: 40;
  }
</style>
