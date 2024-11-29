<script lang="ts">

let {
	BarItems = [[], []],
}: {
	BarItems: [string[],string[]]
} = $props();

let hiddenSubElements: boolean = $state(true)

</script>


<main class="pt-[20px]">
	<button type="button" class="h-fit w-[100%] border-10 pb-[10px] border-gray-400 border-solid border-b-[1px] content-center " onclick={()=>{
		hiddenSubElements = !hiddenSubElements;
	}}>
		<p class="text-center ">{BarItems[0]}</p>
	</button>

		{#if hiddenSubElements === false}

			<div class="h-fit w-[100%]">
				<ul class="h-fit">
					{#each BarItems[1] as item}
						<li class="content-center text-center pt-[8px]">
							<button class="">{item}</button>
						</li>
					{/each}
				</ul>
			</div>

		{/if}
</main>
