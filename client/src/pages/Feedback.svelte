<script lang="ts" module>
    export type User = {
        id: string;
        username: string;
        email: string;
    }
</script>

<script lang="ts">
    let testData = $state([
        {
            id: 1,
            highlightId: 1,
            user: {
                id: "1",
                username: "John Doe"
            },
            rating: 5,
            comment: "John John",
            is_approved: false,
        },
        {
            id: 2,
            highlightId: 2,
            user: {
                id: "2",
                username: "John Typescript"
            },
            rating: 5,
            comment: "typeshit",
            is_approved: false,
        },
        {
            id: 3,
            highlightId: 3,
            user: {
                id: "2",
                username: "John Tailwind"
            },
            rating: 5,
            comment: "just cssing",
            is_approved: false,
        }
    ]);

    import {fetchWithAuthSvelte} from "../lib/utils/fetchWithAuth.svelte";
    import type {Row, TableType} from "../lib/components/table/Table.svelte";
    import Table from "../lib/components/table/Table.svelte";
    import {type ActionConfig} from "../lib/components/table/Action.svelte";

    /**
     * Convert the fetched data into a table that is readable by the Table component
     * @param data
     * */

    function DataToTable(data: {}[]): TableType {
        let columns: string[] = ["Id", "HighlightId", "Username", "Rating", "Comment", "Approved State"];
        let rows: Row[] = [];

        for (let i = 0; i < data.length; i++) {
            let objectEntries = Object.entries(data[i]);
            let row: Row = {
                row: [],
                actionsVisibility: [true,true,true]
            };
            for (let j = 0; j < objectEntries.length; j++) {
                if (objectEntries[j][0] === "user") {
                    let user: User = objectEntries[j][1] as User;
                    row.row.push(`${user.username}`);
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
    let table = $state(DataToTable(testData));

    /*
   * Function to execute when confirming the editing
   * In this case for test purposes we edit the array.
   * In production this will be replaced with an api call
   * */
    let onConfirmEdit = async (newText: string) => {
        currentRow.row[4] = newText;

        const approveFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/highlights/${currentRow.row[1]}/feedbacks/${currentRow.row[0]}`;
        // await fetchWithAuthSvelte(approveFeedbackUrl, {
        //     method: "PUT",
        //     body: JSON.stringify({
        //         comment: currentRow[4],
        //         approvedState: currentRow[5]
        //     }),
        // })
    };
    let onApproveFeedback = async () => {
        currentRow.row[5] = "true";
        currentRow.actionsVisibility = [false,true];
        const approveFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/highlights/${currentRow.row[1]}/feedbacks/${currentRow.row[0]}`;

        // await fetchWithAuthSvelte(approveFeedbackUrl, {
        //     method: "PUT",
        //     body: JSON.stringify({
        //         comment: currentRow[4],
        //         approvedState: currentRow[5]
        //     }),
        // })
    };
    let onRemoveFeedback = async () => {
        let index = testData.findIndex(x=>x.id === parseInt(currentRow.row[0]))

         table.rows.splice(index, 1);
        const removeFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/highlights/${currentRow.row[1]}/feedbacks/${currentRow.row[0]}`;
        // await fetchWithAuthSvelte(removeFeedbackUrl, {
        //     method: "DELETE",
        //     body: JSON.stringify({
        //         comment: currentRow[4],
        //         approvedState: currentRow[5]
        //     }),
        // })
    };


    const feedbacksUrl = `${import.meta.env.VITE_BACKEND_URL}/feedbacks`;
    const feedbacksResp = fetchWithAuthSvelte(feedbacksUrl, {
        method: "GET",
    });

    let enableEditComment = $state(false);
    let enableApproveFeedback = $state(false);
    let enableRemoveFeedback = $state(false);

    let commentValue = $state("");
    let currentRow: Row;


    let actionCssConfig: string = "border-[1px] bg-zinc-950 text-neutral-100 p-[5px] rounded-[6px] border-transparent";
    let approveText: string = "Are you sure you want to approve this feedback?";
    let removalText: string = "Are you sure you want to remove this feedback?";

    let approveActionConfig: ActionConfig = {
        actionName: "Approve",
        actionFunction: (row: any) => {
            console.log("Hi");
            currentRow = row
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


</script>

<main class="w-[100%] flex justify-center">
    <div class="w-fit h-fit pt-[10vh]">
        <Table newTable={table} actionConfigs={configs}></Table>

    </div>
    {#if enableEditComment}
        <EditTextField bind:enabled_popup={enableEditComment} bind:commentValue={commentValue}
                       onConfirmEdit={onConfirmEdit}></EditTextField>
    {/if}
    {#if enableApproveFeedback}
        <WarningPopUp onConfirmFunction={onApproveFeedback} bind:enabled_popup={enableApproveFeedback}
                      popupText={approveText}></WarningPopUp>
    {/if}
    {#if enableRemoveFeedback}
        <WarningPopUp onConfirmFunction={onRemoveFeedback} bind:enabled_popup={enableRemoveFeedback}
                      popupText={removalText}></WarningPopUp>
    {/if}
</main>