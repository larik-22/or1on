<script lang="ts">
import BurgerBarItem from "./BurgerBarItem.svelte";

let {
	BarItems = [],
	Location = ""
}: {
	BarItems: Array<[string, { label: string, action: (actionType: string) => void }[]]>,
	Location: String
} = $props();

let lastClicked: string = $state("0");




</script>

<main>
	<div class="h-lvh min-w-[320px]  w-[15vw] bg-gray-50 shadow-md border-r-[1px] border-solid border-gray-300 overflow-hidden">
		<div class="w-[100%] h-fit pt-[15px] pb-[15px] shadow-md bg-[#f9fafb] text-center content-center ">{Location}</div>
		<ul class="pt-[100px]">
			{#each BarItems as item, i}
				<li>
					<BurgerBarItem BarItem={item} sectionNumber={(i+1)} lastClicked={lastClicked}></BurgerBarItem>
				</li>
			{/each}

		</ul>
	</div>
</main>
