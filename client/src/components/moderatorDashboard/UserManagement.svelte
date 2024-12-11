<script lang="ts">
import ListItem from "../table/Table.svelte";
import WarningPopUp from "./WarningPopUp.svelte";
import type {TableType,Row} from "../table/Table.svelte";
import {fetchWithAuthSvelte} from "../../lib/utils/fetchWithAuth.svelte";
import type {User} from "../../pages/Feedback.svelte";

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

let usersResp = fetchWithAuthSvelte("http://localhost:3000/users", {
	method: "GET",
});

let enabled_popup: boolean = $state(false)

function dataToTable(data: User[]) : TableType {
	let columns: string[] = ["Username", "Id",];
	let rows: Row[] = [];

	for (let i = 0; i < data.length; i++) {
		let row: Row = {
			row: [],
			actionsVisibility: [true]
		}
		for (let j = 0; j < Object.entries(data[i]).length; j++) {
			row.row.push(data[i][j]);
		}
	}
}

let newTable: TableType = dataToTable(testData);



</script>

<main class="flex items-center content-center w-[100%] justify-center">
	<div class="border-[1px] bg-[#f9fafb] shadow-md w-[50vw] h-fit mb-[10vh]">
		<ListItem newTable={newTable}></ListItem>

	</div>

	{#if enabled_popup}
	<WarningPopUp bind:enabled_popup={enabled_popup} popupText="AAA"></WarningPopUp>
	{/if}
</main>