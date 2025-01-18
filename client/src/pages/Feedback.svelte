<script lang="ts" module>
    export type User = {
        id: string;
        username: string;
        email: string;
    }
</script>

<script lang="ts">
    import Modal, {type ModalType} from "../lib/components/Modal.svelte";

    import {fetchWithAuthSvelte} from "../lib/utils/fetchWithAuth.svelte";
    import type {Row, TableType} from "../lib/components/table/Table.svelte";
    import Table from "../lib/components/table/Table.svelte";
    import {type ActionConfig} from "../lib/components/table/Action.svelte";

    let fetchedFeedbacks: any = $state([]);

    async function fetchFeedbacks(): Promise<TableType> {
        const feedbacksUrl = `${import.meta.env.VITE_BACKEND_URL}/feedbacks/`;
        let resp = await fetchWithAuthSvelte(feedbacksUrl);
        fetchedFeedbacks = await resp.json();
        let data = DataToTable(fetchedFeedbacks.users);
        return data;
    }

    /**
     * Convert the fetched data into a table that is readable by the Table component
     * @param data
     * */

    function DataToTable(data: object[]): TableType {
        let columns: string[] = ["Id", "Tour Id", "Highlight Id", "User Id", "Rating", "Comment", "Approved State"];
        let rows: Row[] = [];

        for (let i = 0; i < data.length; i++) {
            let objectEntries = Object.entries(data[i]);
            let row: Row = {
                row: [],
                actionsVisibility: [true, true, true]
            };
            for (let j = 0; j < objectEntries.length; j++) {
                if (objectEntries[j][0] === "user") {
                    let user: User = objectEntries[j][1] as User;
                    row.row.push(`${user.id}`);
                } else if (objectEntries[j][0] === "highlight" && objectEntries[j][1] !== null) {
                    row.row.push(`${objectEntries[j][1].id}`);
                } else if (objectEntries[j][0] === "tour" && objectEntries[j][1] !== null) {
                    row.row.push(`${objectEntries[j][1].id}`);
                } else {
                    row.row.push(`${objectEntries[j][1]}`);
                }
            }
            rows.push(row);
        }

        return {
            columns: columns,
            rows: rows
        };
    }
    /*
   * Function to execute when confirming the editing
   * In this case for test purposes we edit the array.
   * In production this will be replaced with an api call
   * */
    let onConfirmEdit = async () => {

        const approveFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/feedbacks/${currentRow.row[0]}`;
        await fetchWithAuthSvelte(approveFeedbackUrl, {
            method: "PUT",
            body: JSON.stringify({
                "comment": currentRow.row[5],
                "rating": currentRow.row[4]
            }),
        });
    };
    let onApproveFeedback = async () => {
        const approveFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/feedbacks/${currentRow.row[0]}/approve`;

        await fetchWithAuthSvelte(approveFeedbackUrl, {
            method: "PUT",
        })
    };
    let onRemoveFeedback = async () => {
        const removeFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/feedbacks/${currentRow.row[0]}`;
        await fetchWithAuthSvelte(removeFeedbackUrl, {
            method: "DELETE",
        });
    };

    let enableEditComment = $state(false);
    let enableApproveFeedback = $state(false);
    let enableRemoveFeedback = $state(false);

    let commentValue = $state("");
    let currentRow: Row;


    let actionCssConfig: string = "border-[1px] bg-zinc-950 text-neutral-100 p-[5px] rounded-[6px] border-transparent";

    let approveActionConfig: ActionConfig = {
        actionName: "Approve",
        actionFunction: (row: any) => {
            console.log("Hi");
            currentRow = row;
            if (currentRow.row[5] !== "true") {
                enableApproveFeedback = true;
            }
        },
        actionClassStyle: actionCssConfig,
    };

    let editActionConfig: ActionConfig = {
        actionName: "Edit",
        actionFunction: (row: any) => {
            console.log("Hi :3");
            currentRow = row;
            enableEditComment = true;
            commentValue = row.row[4];
        },
        actionClassStyle: actionCssConfig,
    };

    let removeActionConfig: ActionConfig = {
        actionName: "Remove",
        actionFunction: (row: any) => {
            console.log("Hi :3");
            currentRow = row;
            enableRemoveFeedback = true;
        },
        actionClassStyle: actionCssConfig,
    };


    let configs: ActionConfig[] = [approveActionConfig, editActionConfig, removeActionConfig];

    let editModal: ModalType = $state({
        title: "Edit Feedback",
        confirmFunction: () => {
            onConfirmEdit();
        },
        sections: [
            {
                sectionTitle: "Feedback",
                sectionType: "descriptive",
                getValue: () => {
                    return commentValue;
                },
                setValue: (value: any) => {
                    commentValue = value;
                }
            }
        ]
    });

    let approveFeedbackModal: ModalType = {
        title: "Approve Feedback",
        confirmFunction: () => {
            onApproveFeedback()
        },
        sections: []
    };

    let deleteFeedbackModal: ModalType = {
        title: "Delete Feedback",
        confirmFunction: () => {
            onRemoveFeedback()
        },
        sections: []
    };

</script>

<main class="flex items-center content-center w-[100%] h-[100vh] justify-center overflow-x-scroll overflow-y-scroll">
    {#await fetchFeedbacks()}
        Loading...
    {:then table}
        <div class="w-full  max-w-fit">
            <Table newTable={table} actionConfigs={configs}></Table>
        </div>
    {/await}

    {#if enableEditComment}
        <Modal bind:modal={editModal} bind:enableEditModal={enableEditComment}></Modal>
    {/if}
    {#if enableApproveFeedback}
        <Modal modal={approveFeedbackModal} bind:enableEditModal={enableApproveFeedback}></Modal>
    {/if}
    {#if enableRemoveFeedback}
        <Modal modal={deleteFeedbackModal} bind:enableEditModal={enableRemoveFeedback}></Modal>
    {/if}
</main>