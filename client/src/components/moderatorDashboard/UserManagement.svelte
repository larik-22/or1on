<script lang="ts">
import ListItem from "./Table.svelte";
import WarningPopUp from "./WarningPopUp.svelte";
import type {Table} from "./Table.svelte";
let enabled_popup: boolean = $state(false)


let newTable: Table = {
	columns: ["Username", "Id"],
	rows: [
		["Alex","1234"],
		["Alex","1234"],
		["Alex","1234"]
	]
}

</script>

<main class="flex items-center content-center w-[100%] justify-center">
	<div class="border-[1px] bg-[#f9fafb] shadow-md w-[50vw] h-fit mb-[10vh]">
		<ListItem newTable={newTable}></ListItem>

	</div>

	{#if enabled_popup}
	<WarningPopUp bind:enabled_popup={enabled_popup} popupText="AAA"></WarningPopUp>
	{/if}
</main>