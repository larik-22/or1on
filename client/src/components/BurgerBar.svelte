<script lang="ts">
import BurgerBarItem from "./BurgerBarItem.svelte";

let {
	BarItems = [[[], []]],
}: {
	BarItems: Array<[string[],string[]]>
} = $props();

</script>


<main>
	<div class="h-lvh w-[25vh] bg-gray-200 border-r-[1px] border-solid border-gray-300">
		<div class="w-[100%] h-[5vh] bg-gray-500 text-center content-center">Admin</div>
		<ul class="pt-[100px]">
			{#each BarItems as item}
				<li>
					<BurgerBarItem BarItems={item}></BurgerBarItem>
				</li>
			{/each}

		</ul>
	</div>
</main>
