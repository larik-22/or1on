<script lang="ts">
	import type { Feedback } from "../../models/models";
	let feedbackData: any = $props();
</script>

<div class="max-h-60 overflow-y-auto bg-gray-50 rounded-xl shadow-md p-4 space-y-4">
	{#if feedbackData?.data.length > 0}
		{#each feedbackData.data as feedback (feedback.id)}
			<div class="flex items-start gap-4 border-b pb-3 last:border-b-0">
				<div class="flex-shrink-0">
					<div class="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-gray-500 text-lg font-medium">
						{feedback.user.username.charAt(0).toUpperCase()}
					</div>
				</div>
				<div class="flex-1">
					<div class="flex justify-between items-center">
						<h3 class="font-semibold text-gray-800">
							{feedback.user.username}
						</h3>
						<div class="text-sm text-gray-500">{feedback.rating} ★</div>
					</div>
					<p class="text-sm text-gray-600 mt-1">
						{feedback.comment}
					</p>
				</div>
			</div>
		{/each}
	{:else}
		<p class="text-gray-500 text-center">No feedback available yet.</p>
	{/if}
</div>

