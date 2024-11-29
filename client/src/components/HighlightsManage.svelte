<script lang="ts">
let {
	highlights = [
		["Highlight 1", "John Doe", "4", "description here", "25/25/2525"],
		["Highlight 2", "John Doe", "4", "description here", "25/25/2525"],
		["Highlight 3", "John Doe", "4", "description here", "25/25/2525"],
		["Highlight 4", "John Doe", "4", "description here", "25/25/2525"],
	]
} : { highlights? : Array<string[]> } = $props();
</script>

<main class="h-[100vh] w-[100%] bg-gray-300 flex justify-center items-center">
	<div class="rounded-[8px] h-fit w-fit bg-gray-400 items p-[10vh] flex justify-center content-center">

		<ul>
			{#each highlights as highlight}
				<li class="pt-[30px]">
					<div class="flex flex-row gap-[55px]">
						<p class="text-[2vh]">{highlight[0]}</p>
						<p class="text-[2vh]">{highlight[1]}</p>
						<p class="text-[2vh]">{highlight[2]} stars</p>
						<p class="text-[2vh]">{highlight[3]}</p>
						<p class="text-[2vh]">{highlight[4]}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</main>