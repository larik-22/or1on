<script lang="ts" module>
    export type User = {
        id: string;
        username: string;
        email: string;
    }
</script>

<script lang="ts">
    import {fetchWithAuthSvelte} from "../lib/utils/fetchWithAuth.svelte";
    import type {Row, TableType} from "../lib/components/table/Table.svelte";
    import Table from "../lib/components/table/Table.svelte";
    import {type ActionConfig} from "../lib/components/table/Action.svelte";
    import Modal, {type ModalType} from "../lib/components/Modal.svelte"
    import {decodeToken, authToken} from "../lib/stores/auth"

    let userPayload = decodeToken($authToken);
    let userId;
    if (userPayload !== null) {
        userId = userPayload.id;
    }
    const feedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/feedbacks`;

    async function fetchUserFeedbacks(): Promise<object[]> {
        let data = await fetchWithAuthSvelte(feedbackUrl)
        return await data.json()
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
            let tempRow: [] = [];
            let actionsVisibility : boolean[] = [];
            let row: Row = {
                row: tempRow,
                actionsVisibility: actionsVisibility
            };
            for (let j = 0; j < objectEntries.length; j++) {
                if (objectEntries[j][0] === "is_approved"  && objectEntries[j][1] === true) {
                    actionsVisibility = [false]
                }else{
                    actionsVisibility = [true]
                }

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

    let onRemoveFeedback = async () => {
        const removeFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/feedbacks/${currentRow.row[0]}`;
        await fetchWithAuthSvelte(removeFeedbackUrl, {
            method: "DELETE",
        });
    };

    let enableEditComment = $state(false);
    let deleteFeedbackModal = $state(false)

    let feedBackValue: string = $state("");
    let ratingValue = $state();
    let currentRow: Row;

    let actionCssConfig: string = "border-[1px] bg-zinc-950 text-neutral-100 p-[5px] rounded-[6px] border-transparent";

    let editActionConfig: ActionConfig = {
        actionName: "Edit",
        actionFunction: (row: any) => {
            currentRow = row;
            enableEditComment = true;
            feedBackValue = row.row[5];
        },
        actionClassStyle: actionCssConfig,
    };

    let deleteActionConfig: ActionConfig = {
        actionName: "Delete",
        actionFunction: (row: any) => {
            currentRow = row;
            deleteFeedbackModal = true;
            feedBackValue = row.row[5];
        },
        actionClassStyle: actionCssConfig,
    };

    let configs: ActionConfig[] = [editActionConfig, deleteActionConfig];

    let modal: ModalType = $state({
        title: "Edit Feedback",
        confirmFunction: () => {
            onConfirmEdit()
        },
        sections : [
            {
                sectionTitle: "Feedback",
                sectionType: "descriptive",
                getValue: ()=> {
                    return feedBackValue;
                },
                setValue: (newValue: any) => {
                    console.log("newValue: ", newValue);
                    feedBackValue = newValue;
                }
            },
            {
                sectionTitle: "Rating",
                sectionType: "number",
                minValue: 1,
                maxValue: 6,
                getValue: ()=> {
                    return ratingValue;
                },
                setValue: (newValue: any) => {
                    ratingValue = newValue;
                }
            }
        ]
    })

    let deleteModal : ModalType = $state({
        title: "Delete Feedback",
        confirmFunction: () => {
            onRemoveFeedback()
        },
        sections : []
    })

</script>

<main class="w-[100%] flex justify-center">
    {#await fetchUserFeedbacks()}
        Loading...
    {:then data}
        <div class="w-fit h-fit pt-[10vh]">
            <Table newTable={DataToTable(data)} actionConfigs={configs}></Table>
        </div>

        {#if enableEditComment}
            <div>
                <Modal bind:modal={modal} bind:enableEditModal={enableEditComment}></Modal>
            </div>
        {/if}
        {#if deleteFeedbackModal}
            <Modal bind:modal={deleteModal} bind:enableEditModal={deleteFeedbackModal} ></Modal>
        {/if}
    {/await}
</main>