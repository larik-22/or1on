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

<main class="h-[100vh] w-[100%] flex justify-center items-center">
	<div class="rounded-[8px] h-fit w-fit bg-gray-50 shadow-md items p-[10vh] flex justify-center content-center">

	<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
      <td>Cell 3</td>
    </tr>
    <tr>
      <td>Cell 4</td>
      <td>Cell 5</td>
      <td>Cell 6</td>
    </tr>
  </tbody>
</table>
		<!--<ul>-->
		<!--	{#each highlights as highlight}-->
		<!--		<li class="pt-[30px]">-->
		<!--			<div class="flex flex-row gap-[55px]">-->
		<!--				<p class="text-[2vh]">{highlight[0]}</p>-->
		<!--				<p class="text-[2vh]">{highlight[1]}</p>-->
		<!--				<p class="text-[2vh]">{highlight[2]} stars</p>-->
		<!--				<p class="text-[2vh]">{highlight[3]}</p>-->
		<!--				<p class="text-[2vh]">{highlight[4]}</p>-->
		<!--			</div>-->
		<!--		</li>-->
		<!--	{/each}-->
		<!--</ul>-->
	</div>
</main>

<style>
table, th, td {
		border: 1px solid;
		border-collapse: collapse;
		margin-bottom: 10px;
		padding-left: 30px;
		padding-right: 30px;
	}
</style>