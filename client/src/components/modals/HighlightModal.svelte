<script lang="ts">
	import {fade} from "svelte/transition";
	import type { ModalProps } from 'svelte-modals'

	interface HighlightModalProps extends ModalProps {
		highlightName: string,
		highlightDescription: string,
		highlightId: string,
	}

	const { isOpen, highlightName, highlightId, highlightDescription, close }: HighlightModalProps = $props()
</script>

{#if isOpen}
	<div
			role="dialog"
			class="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
			transition:fade|global={{duration: 300}}
	>
		<div class="p-6 bg-white w-[600px] h-[600px] rounded-md" data-highlight-id={highlightId}>
			<h2>{highlightName}</h2>
			<p>{highlightDescription}</p>

			<div class="modal-actions">
				<button onclick={() => close()}>OK</button>
			</div>
		</div>
	</div>
{/if}