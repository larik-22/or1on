<script lang="ts">
	import BurgerBar from "../components/BurgerBar.svelte";
	import HighlightsManage from "../components/HighlightsManage.svelte";

	let BarItems: Array<[string[],string[]]> = [
		[["Users"],["Manage"]],
		[["Highlights"],["Manage","Suggestions","Feedback"]],
		[["Tours"],["Manage","Feedback"]]

	];
</script>


<main class="flex">
	<BurgerBar BarItems={BarItems}></BurgerBar>
	<HighlightsManage></HighlightsManage>
</main>


<style>

</style>