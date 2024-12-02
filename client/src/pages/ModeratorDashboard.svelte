<script lang="ts">
	import BurgerBar from "../components/burgerBar/BurgerBar.svelte";
	import HighlightsManage from "../components/moderatorDashboard/HighlightsManage.svelte";
	import UserManagement from "../components/moderatorDashboard/UserManagement.svelte";
	import WarningPopUp from "../components/moderatorDashboard/WarningPopUp.svelte";
let actionT = $state("none")

let BarItems: Array<[string,{label: string, action: (actionType: string)=> void}[]]> = [
		["Users",[{label: "Manage", action: (actionType: string) => {
				actionT = actionType
		}}]],
		["Highlights",[
			{label: "Manage", action: () => {

			}},

			{label: "Suggestions", action: () => {

			}},

			{label: "Feedback", action: () => {

			}}
		]],

		["Tours",[{label: "Manage", action: () => {

		}}]]
];


</script>


<main class="flex">
	<BurgerBar BarItems={BarItems} Location={"Moderator Dashboard"}></BurgerBar>
	<!--<HighlightsManage></HighlightsManage>-->
	{#if actionT === "Manage"}

		<UserManagement></UserManagement>

	{/if}

</main>


<style>

</style>