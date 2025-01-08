<script lang="ts">

	interface FilterDropdownProps {
		applyFilter: () => void;
		currentFilter: string[];
		filterOptions: any[]
	}

	let {applyFilter, currentFilter = $bindable(), filterOptions}: FilterDropdownProps = $props();

	let isOpen: boolean = $state(false);

	const toggleDropdown = () => {
		isOpen = !isOpen;
	}
</script>

<div class="relative min-w-64">
	<button
			class="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-between w-full hover:bg-blue-600 transition duration-200 shadow-md focus:outline-none focus:ring focus:ring-blue-300"
			onclick={toggleDropdown}
			aria-label={isOpen ? "Close Dropdown" : "Open Dropdown"}
	>
		Choose a categories to display
		<svg
				class="w-4 h-4 ml-2 transform transition-transform duration-200"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				class:rotate-180={isOpen}
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
		</svg>
	</button>

	{#if currentFilter.length > 0}
		<button
				class="mt-2 bg-red-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-red-600 transition duration-200 focus:outline-2 focus:ring focus:ring-red-300 flex items-center"
				aria-label="Clear Filters"
				onclick={() => {
					currentFilter = [];
					applyFilter();
				}}>
			<svg
					class="w-4 h-4 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
			Clear Filters
		</button>
	{/if}

	{#if isOpen}
		<div class="absolute bg-white shadow-lg rounded-lg mt-2 w-full z-10 border border-gray-200" aria-hidden={!isOpen}>
			{#each filterOptions as type}
				<label class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
					<input
							type="checkbox"
							value={type}
							onchange={applyFilter}
							bind:group={currentFilter}
					/>
					{type}
				</label>
			{/each}
		</div>
	{/if}
</div>