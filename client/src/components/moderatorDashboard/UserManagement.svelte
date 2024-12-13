<script lang="ts">
import ListItem from "../table/Table.svelte";
import WarningPopUp from "./WarningPopUp.svelte";
import type {TableType,Row} from "../table/Table.svelte";
import {fetchWithAuthSvelte} from "../../lib/utils/fetchWithAuth.svelte";
import type {User} from "../../pages/Feedback.svelte";
import Table from "../table/Table.svelte";
import type {ActionConfig} from "../table/Action.svelte";

let testData = [
	{
		id: "1",
		username: "Alex",
		email: "Alex@gmail.com",
	},
	{
		id: "2",
		username: "George",
		email: "George@gmail.com",
	},
	{
		id: "3",
		username: "Geralt",
		email: "Geralt@gmail.com",
	}
]

const usersUrl = `${import.meta.env.VITE_BACKEND_URL}/users}`;

let usersResp = fetchWithAuthSvelte(usersUrl, {
	method: "GET",
});

let enabled_popup: boolean = $state(false)
let currentRow: Row;

function dataToTable(data: User[]): TableType {
	let columns: string[] = ["Id", "Username","Email"];
	let rows: Row[] = [];

	for (let i = 0; i < data.length; i++) {
		let row: Row = {
			row: [],
			actionsVisibility: [true]
		}
		row.row.push(data[i].id);
		row.row.push(data[i].username);
		row.row.push(data[i].email)
		rows.push(row);
	}
	return {
		columns: columns,
		rows: rows,
	}
}

let newTable: TableType = $state(dataToTable(testData))
let customCss: string = "border-transparent w-[100%] h-[100%]";

let lockAccountActionConfig: ActionConfig = {
	actionName : "Lock",
	actionFunction: async (row:any)=>{
		currentRow = row;
		if (currentRow.actionsVisibility[0] === true){
			console.log("Locking")
			currentRow.actionsVisibility = [false]
		}
	},
	actionClassStyle: customCss
}

</script>

<main class="flex items-center content-center w-[100%] justify-center">
	<div class="border-[1px] bg-[#f9fafb] shadow-md w-[50vw] h-fit mb-[10vh]">
		<Table newTable={newTable} actionConfigs={[lockAccountActionConfig]} ></Table>

	</div>

	{#if enabled_popup}
	<WarningPopUp bind:enabled_popup={enabled_popup} popupText="AAA"></WarningPopUp>
	{/if}
</main>