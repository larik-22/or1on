<script lang="ts" module>
	export type Table = {
		columns: string[]
		rows: Array<string[]>
	}

</script>

<script lang="ts">
	let {
		newTable,
		actionsSlot = true, // Whether to show the slot for custom actions
		actionElement,
	}: {
		newTable: Table
		actionsSlot?: boolean;
		actionElement?: any;
	} = $props();
</script>

<main class="w-full">
	<div class="bg-gray-50 shadow-md rounded">
		<table class="table-auto w-full text-left border-collapse">
			<!-- Table Headers -->
			<thead>
			<tr>
				{#each newTable.columns as column}
					<th class="border px-4 py-2 bg-gray-200 font-bold">{column}</th>
				{/each}
				{#if actionsSlot}
					<th class="border px-4 py-2 bg-gray-200 font-bold">Actions</th>
				{/if}
			</tr>
			</thead>
			<!-- Table Rows -->
			<tbody>
			{#each newTable.rows as row}
				<tr>
					{#each row as element}
						<td class="border px-4 py-2">{element}</td>
					{/each}
					{#if actionsSlot}
						<td class="border px-4 py-2">

						</td>
					{/if}
				</tr>
			{/each}
			</tbody>
		</table>
	</div>
</main>