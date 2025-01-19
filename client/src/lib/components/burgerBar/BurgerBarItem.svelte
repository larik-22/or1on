<script lang="ts">
	import type {BarItem} from "./BurgerBar.svelte";

	let {
		Item = {
			label: "Placeholder",
		},
		sectionNumber,
		lastClicked = $bindable(""),
		paddingTop = "pt-[20px]",
		showSideBar = $bindable(),
	}: {
		Item: BarItem;
		sectionNumber?: number
		lastClicked?: string
		paddingTop?: string,
		showSideBar: boolean,
	} = $props();

	let hiddenSubElements: boolean = $state(true)
	let innerWidth: number = $state(window.innerWidth);
</script>

<main class="flex flex-col items-center {paddingTop}">
	<button
			class="h-fit w-[90%] rounded-[2px] text-[17px]  pt-[10px] pb-[10px] content-center
            hover:bg-[#f2f2f2] font-[500] active:bg-[#ececec] border-b-[1px] border-[#cacaca]"
			onclick={() =>
            {
                if (Item.overrideFunction !== undefined && Item.overrideClick){
                    Item.overrideFunction();
					if (innerWidth < 640 && showSideBar === true){
						showSideBar = false;
					}
                }else{
                    hiddenSubElements = !hiddenSubElements;
                }
            }}
			type="button">
		<p class="text-center">{Item.label}</p>
	</button>

	{#if Item.subitems !== undefined && hiddenSubElements === false}
		<div class="h-fit w-[100%]">
			<ul class="h-fit">
				{#each Item.subitems as item, i}
					<li class="content-center text-center pt-[8px]">
						<button onclick={()=>{
                            item.action();
                            lastClicked = ""
                            lastClicked = "tab" + (i+1) + "" + sectionNumber;
							if (innerWidth < 640 && showSideBar === true){
								showSideBar = false;
							}
                        }} class:bg-[#ececec]={lastClicked === "tab" + (i+1) + "" + sectionNumber} class="h-fit w-[65%] rounded-[2px] text-[18px] text-[#374151]  pt-[8px] pb-[8px] content-center
                        hover:bg-[#f2f2f2] active:bg-[#ececec] ">{item.label}</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</main>