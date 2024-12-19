<script lang="ts">
	import type { Feedback } from "../../models/models";

	//TODO once backend is implemented, replace mockFeedbackData with feedbackData
	let feedbackData: any[] = $props();
	const mockFeedbackData: Feedback[] = [
		{
			id: 1,
			highlight: {
				id: 3,
				name: "Highlight 3"
			},
			user: {
				id: "123e4567-e89b-12d3-a456-426614174000",
				username: "john_doe",
				email: "john_doe@example.com"
			},
			rating: 5,
			comment: "Great highlight!",
			businessOffer: "10% off"
		},
		{
			id: 2,
			highlight: {
				id: 3,
				name: "Highlight 3"
			},
			user: {
				id: "123e4567-e89b-12d3-a456-426614174001",
				username: "jane_doe",
				email: "jane_doe@example.com"
			},
			rating: 4,
			comment: "Very informative.",
			businessOffer: null
		},
		{
			id: 3,
			highlight: {
				id: 3,
				name: "Highlight 3"
			},
			user: {
				id: "123e4567-e89b-12d3-a456-426614174002",
				username: "alice_smith",
				email: "alice_smith@example.com"
			},
			rating: 3,
			comment: "It was okay.",
			businessOffer: "Free drink"
		}
	];

	feedbackData = mockFeedbackData;
</script>

<div class="max-h-60 overflow-y-auto bg-gray-50 rounded-xl shadow-md p-4 space-y-4">
	{#if mockFeedbackData && mockFeedbackData.length > 0}
		{#each mockFeedbackData as feedback (feedback.id)}
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

