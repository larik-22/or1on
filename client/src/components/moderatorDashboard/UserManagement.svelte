<script lang="ts">
import ListItem from "../moderatorDashboard/ListItem.svelte";
import WarningPopUp from "./WarningPopUp.svelte";
let enabled_popup: boolean = $state(false)
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

</script>

<main class="flex items-center content-center w-[100%] justify-center">
	<div class="border-[1px] bg-[#f9fafb] shadow-md w-[50vw] h-fit mb-[10vh]">
		<ListItem disableButton={true} user={{username: "Username:", role: "Role:", id: "ID:"}} bind:enabled_popup={enabled_popup}></ListItem>
		<ul class="overflow-y-scroll max-h-[600px]">
			{#each users as user, i}
				<ListItem user={user} disableButton={false} bind:enabled_popup={enabled_popup}></ListItem>
			{/each}
		</ul>
	</div>

	{#if enabled_popup}
	<WarningPopUp bind:enabled_popup={enabled_popup} popupText="AAA"></WarningPopUp>
	{/if}
</main>