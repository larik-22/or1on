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
    const feedbackUrl = `${import.meta.env.VITE_BACKEND_URL}users/${userId}/feedbacks`;

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    async function fetchUserFeedbacks(): Promise<{}[]> {
        let data = await fetchWithAuthSvelte(feedbackUrl)
        return await data.json()
    }
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    /**
     * Convert the fetched data into a table that is readable by the Table component
     * @param data
     * */

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    function DataToTable(data: {}[]): TableType {
        let columns: string[] = ["Id", "Tour", "HighlightId", "Username", "Rating", "Comment", "Approved State"];
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
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    /*
   * Function to execute when confirming the editing
   * In this case for test purposes we edit the array.
   * In production this will be replaced with an api call
   * */
    // let onConfirmEdit = async (newText: string) => {
    //     currentRow.row[4] = newText;
    //     const approveFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/highlights/${currentRow.row[2]}/feedbacks/${currentRow.row[0]}`;
    //     await fetchWithAuthSvelte(approveFeedbackUrl, {
    //         method: "PUT",
    //         body: JSON.stringify({
    //             name: currentRow[4],
    //             approvedState: currentRow[5]
    //         }),
    //     })
    // };


    let enableEditComment = $state(false);

    let feedBackValue: string = $state("");
    let ratingValue = $state();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let currentRow: Row;

    let actionCssConfig: string = "border-[1px] bg-zinc-950 text-neutral-100 p-[5px] rounded-[6px] border-transparent";

    let editActionConfig: ActionConfig = {
        actionName: "Edit",
        actionFunction: (row: any) => {
            console.log("Hi :3");
            currentRow = row;
            enableEditComment = true;
            feedBackValue = row.row[5];
        },
        actionClassStyle: actionCssConfig,
    };

    let configs: ActionConfig[] = [editActionConfig];

    let modal: ModalType = $state({
        title: "User Feedback",
        confirmFunction: () => {
            console.log("User Feedback Confirm");
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
    {/await}
</main>