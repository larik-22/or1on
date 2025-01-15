<script lang="ts">

	let {
		popupText = "Placeholder",
		enabled_popup = $bindable(false),
		onConfirmFunction,
	}: {
		popupText: string
		enabled_popup: boolean
		onConfirmFunction: (value?: any) => void
	} = $props();

</script>

{#if enabled_popup}
	<main class="bg-black bg-opacity-50 h-full w-full fixed inset-0 flex items-center justify-center">
		<div class="bg-white shadow-lg rounded-lg w-[400px] p-6 relative">
			<!-- Close button -->
			<button
					onclick={() => {
					enabled_popup = false;
				}}
					class="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
			>
				&times;
			</button>

			<!-- Warning text -->
			<div class="text-center mb-6">
				<p class="text-lg font-semibold text-gray-800">{popupText}</p>
			</div>

			<!-- Yes and No buttons -->
			<div class="flex justify-center gap-6">
				<button
						class="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
						onclick={() => {
						onConfirmFunction();
						enabled_popup = false;
					}}
				>
					Yes
				</button>
				<button
						class="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
						onclick={() => {
						enabled_popup = false;
					}}
				>
					No
				</button>
			</div>
		</div>
	</main>
{/if}