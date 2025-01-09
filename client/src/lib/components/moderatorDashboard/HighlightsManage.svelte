<script lang="ts">

  import Table from "../table/Table.svelte";
  import Modal, {type ModalType} from "../Modal.svelte";
  import type { TableType, Row } from "../table/Table.svelte";
  import { type ActionConfig } from "../table/Action.svelte";
  import WarningPopUp from "./WarningPopUp.svelte";
  import {onMount} from "svelte";

  const API_BASE =  `${import.meta.env.VITE_BACKEND_URL}/highlights`;

  // State variables
  let highlights = [];
  let newTable: TableType = { columns: [], rows: [] };
  let enableModal = false;
  let enabled_popup = false; // Matches WarningPopUp prop
  let modalConfig: ModalType;
  let popupText = "";
  let currentHighlightRow: Row | null = null;

  // stores the currently selected highlight for add/edit actions
  let currentHighlight = {
    id: 0,
    name: "",
    description: "",
    category: "",
    latitude: null,
    longitude: null,
    is_approved: false,
    businessDescription: null,
  };

  async function fetchHighlights() {
    try {
      const response = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      highlights = data.highlights || [];
      newTable = formatTableData(highlights);
    } catch (error) {
      console.error("Failed to fetch highlights:", error);
    }
  }

  // Format highlights into Table format
  function formatTableData(data) {
    // sort highlights by id in ascending order
    data.sort((a, b) => a.id - b.id);

    return {
      columns: ["ID", "Name", "Description", "Category", "Business Description"],
      rows: data.map((highlight) => ({
        row: [
          highlight.id.toString(),
          highlight.name,
          highlight.description,
          highlight.category,
          highlight.businessDescription || "none",
        ],
        actionsVisibility: [true, true],
      })),
    };
  }

  // Open the modal for add/edit actions
  function openModal(action: "add" | "edit", row: Row | null = null) {
    enableModal = true;

    if (action === "edit" && row) {
      const id = parseInt(row.row[0]);
      const existingHighlight = highlights.find((h) => h.id === id);
      currentHighlight = { ...existingHighlight };
    } else {
      currentHighlight = {
        id: 0,
        name: "",
        description: "",
        category: "",
        latitude: null,
        longitude: null,
        businessDescription: null,
      };
    }

    modalConfig = {
      title: action === "edit" ? "Edit Highlight" : "Add Highlight",
      sections: [
        {
          sectionTitle: "Name",
          sectionType: "basic",
          getValue: () => currentHighlight.name,
          setValue: (value) => (currentHighlight.name = value),
        },
        {
          sectionTitle: "Description",
          sectionType: "descriptive",
          getValue: () => currentHighlight.description,
          setValue: (value) => (currentHighlight.description = value),
        },
        {
          sectionTitle: "Category",
          sectionType: "basic",
          getValue: () => currentHighlight.category,
          setValue: (value) => (currentHighlight.category = value),
        },
        {
          sectionTitle: "Business Description",
          sectionType: "descriptive",
          getValue: () => currentHighlight.businessDescription,
          setValue: (value) => (currentHighlight.businessDescription = value),
        },
      ],
      confirmFunction: action === "edit" ? saveEditHighlight : saveNewHighlight,
    };
  }

  // Save new highlight to backend
  async function saveNewHighlight() {
    console.log("payload sent to backend: ", currentHighlight)
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(currentHighlight),
      });

      if (response.ok) {
        await fetchHighlights(); // refresh
      } else {
        const errorData = await response.json();
        console.error("Failed to save new highlight: ", errorData);
      }
    } catch (error) {
      console.error("Error saving new highlight:", error);
    }
  }

  // Save edited highlight to backend
  async function saveEditHighlight() {
    try {
      const response = await fetch(`${API_BASE}/${currentHighlight.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(currentHighlight),
      });

      if (response.ok) {
        await fetchHighlights(); // refresh
      } else {
        console.error("Failed to update highlight");
      }
    } catch (error) {
      console.error("Error updating highlight:", error);
    }
  }

  // Trigger warning popup for delete confirmation
  function openDeletePopup(row: Row) {
    currentHighlightRow = row;
    popupText = `Are you sure you want to delete the highlight: "${row.row[1]}"?`;
    enabled_popup = true;
  }


  // Delete a highlight
  async function confirmDeleteHighlight() {
    if (currentHighlightRow) {
      const id = parseInt(currentHighlightRow.row[0]);
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          await fetchHighlights(); // Refresh
        } else {
          console.error("Failed to delete highlight");
        }
      } catch (error) {
        console.error("Error deleting highlight:", error);
      }
    }
  }

  // Table action configurations
  const actionConfigs: ActionConfig[] = [
    {
      actionName: "Edit",
      actionFunction: (row) => openModal("edit", row),
      actionClassStyle: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
    },
    {
      actionName: "Delete",
      actionFunction: openDeletePopup,
      actionClassStyle: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
    },
  ];

  onMount(() => {
    fetchHighlights();
  });


</script>

<main class="flex flex-col items-center w-full min-h-screen bg-gray-50 py-8">
  <!-- Title -->
  <div class="w-4/5">

    <hr class="border-t-2 border-gray-200 mb-6" />
  </div>

  <!-- Table for showing highlights -->
  <div class="bg-white shadow-lg rounded-lg w-4/5 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Manage Highlights</h1>
    <hr class="border-t-2 border-gray-200 mb-6" />
    <Table {newTable} actionsSlot={true} {actionConfigs} />

    <div class="flex justify-end mt-6">
      <button
              class="bg-green-500 text-white px-5 py-3 rounded-lg font-medium shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
              on:click={() => openModal("add")}
      >
        + Add Highlight
      </button>
    </div>
  </div>

  <!-- Warning popup for delete confirmation -->
  {#if enabled_popup}
    <WarningPopUp
            bind:enabled_popup
            popupText={popupText}
            onConfirmFunction={confirmDeleteHighlight}
    />
  {/if}

  <!-- add/edit actions -->
  {#if enableModal}
    <Modal bind:modal={modalConfig} bind:enableEditModal={enableModal} />
  {/if}
</main>

<style>
  main {
    font-family: "Arial", sans-serif;
  }

  h1 {
    text-align: left;
  }

  hr {
    border-color: #e5e7eb;
  }

  button:focus {
    outline: none;
  }
</style>