<script lang="ts">
import Table, {type Row, type TableType} from "../table/Table.svelte";
import type {ActionConfig} from "../table/Action.svelte";
import {fetchWithAuthSvelte} from "../../utils/fetchWithAuth.svelte";
import Modal, {type ModalType} from "../Modal.svelte";

let toggleTrustUserConfirmation: boolean = $state(false);
let email: string = $state("")

async function fetchUsers() : Promise<TableType>{
	const approveFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/users`;
	let resp = await fetchWithAuthSvelte(approveFeedbackUrl);
	fetchedUsers = await resp.json();
	let data = DataToTable(fetchedUsers.users)
	return data
}

function DataToTable(data: object[]): TableType {
	let columns: string[] = ["User Id", "Username", "Email", "Is Admin", "Is Verified"];
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
			if (objectEntries[j][0] !== "password" && objectEntries[j][0] !== "highlights") {
				if (objectEntries[j][0] === "verified" && objectEntries[j][1] === true) {
					actionsVisibility = [true, false];
				}
				else{
					actionsVisibility = [true, true];
				}
				row.row.push(`${objectEntries[j][1]}`);
			}
		}
		row.row = tempRow;
		row.actionsVisibility = actionsVisibility;
		rows.push(row);
	}

	return {
		columns: columns,
		rows: rows
	};
}

let fetchedUsers : any = $state([])
let actionCssConfig = "border-[1px] bg-zinc-950 text-neutral-100 p-[5px] rounded-[6px] border-transparent truncate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentRow : Row;

let lockUserAccount: ActionConfig = {
	actionName: "Lock",
	actionFunction: (row: any) => {
		currentRow = row;

		console.log("Hi :3");

	},
	actionClassStyle: actionCssConfig,
};

let toggleTrustUser: ActionConfig = {
	actionName: "Trust User",
	actionFunction: (row: any) => {
		currentRow = row;

		email = row.row[2];
		toggleTrustUserConfirmation = true;

	},
	actionClassStyle: actionCssConfig,
};


let configs: ActionConfig[] = [lockUserAccount, toggleTrustUser];
let modal: ModalType = {
	title : "Verify user?",
	confirmFunction : async ()=>{
		const approveFeedbackUrl = `${import.meta.env.VITE_BACKEND_URL}/users/${email}/trust`;
		let resp = await fetchWithAuthSvelte(approveFeedbackUrl, {
			method: "PUT"
		});
		fetchedUsers = await resp.json();
		// window.location.reload();
	},
	sections : []
}

</script>

<main class="flex items-center content-center w-[100%] h-[100vh] justify-center overflow-x-scroll overflow-y-scroll">
	{#await fetchUsers()}
		Loading...
<!--eslint-disable-next-line @typescript-eslint/no-unused-vars-->
	{:then table}
		<div class="w-full max-w-fit">
			<Table newTable={table} actionConfigs={configs}></Table>
		</div>
		{#if toggleTrustUserConfirmation}
			<Modal bind:enableEditModal={toggleTrustUserConfirmation} modal={modal} ></Modal>
		{/if}
	{/await}

</main>