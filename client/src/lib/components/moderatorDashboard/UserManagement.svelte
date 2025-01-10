<script lang="ts">
import Table, {type Row, type TableType} from "../table/Table.svelte";
import type {User}  from "../../../pages/Feedback.svelte"
import type {ActionConfig} from "../table/Action.svelte";
let users = [
	{
		username: "Alex",
		role: "user",
		id: "1234"
	},
	{
		username: "Alex",
		role: "user",
		id: "1234"
	},
	{
		username: "Alex",
		role: "user",
		id: "1234"
	},
	{
		username: "Alex",
		role: "user",
		id: "1234"
	},
	{
		username: "Alex",
		role: "user",
		id: "1234"
	},
	{
		username: "Alex",
		role: "user",
		id: "1234"
	},
	{
		username: "Alex",
		role: "user",
		id: "1234"
	},
	{
		username: "Alex",
		role: "user",
		id: "1234"
	},
]

function DataToTable(data: object[]): TableType {
	let columns: string[] = ["Username", "Role", "User ID"];
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
				row.row.push(`${user.id}`);
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

let table = $state(DataToTable(users));
let actionCssConfig = "border-[1px] bg-zinc-950 text-neutral-100 p-[5px] rounded-[6px] border-transparent";

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

		console.log("Hi :3");
	},
	actionClassStyle: actionCssConfig,
};


let configs: ActionConfig[] = [lockUserAccount, toggleTrustUser];


</script>

<main class="flex items-center content-center w-[100%] justify-center">
	<div class="border-[1px] bg-[#f9fafb] shadow-md w-[50vw] h-fit mb-[10vh]">
		<Table newTable={table} actionConfigs={configs}></Table>
	</div>
</main>