<script lang="ts">
	import {feedbackSchema} from "../../schema/feedbackSchema";
	import {isUserAdmin, isUserLoggedIn} from "../../stores/auth";
	import {modals} from "svelte-modals";
	import page from "page";

	export type feedbackFormPayload = {
		rating: number;
		feedbackMessage: string;
	};

	let { formSubmitted } = $props();

	let feedbackData: feedbackFormPayload = $state({
		rating: 0,
		feedbackMessage: "",
	})

	let validated: boolean = $state(false);

	// Validate feedback data every time it changes
	$effect(() => {
		validated = feedbackSchema.safeParse(feedbackData).success;
	});

	/**
	 * Handle form submission with provided feedback data
	 * @param event - The form submission event
	 */
	const handleSubmit = (event: Event) => {
		event.preventDefault();
		formSubmitted(feedbackData);
	};

	/**
	 * Select a rating for the feedback
	 * @param value
	 */
	const selectRating = (value: number) => {
		if (value < 1 || value > 5) {
			return;
		}

		feedbackData.rating = value;
	};
</script>

<form
		onsubmit={handleSubmit}
		class="bg-gray-50 rounded-lg shadow-md p-6 space-y-6"
>
	<!-- Star Rating -->
	<div>
		<p class="block text-sm font-medium text-gray-700">
			Your Rating <span class="text-red-500">*</span>
		</p>
		<div class="flex items-center space-x-2 mt-2">
			{#each [0, 1, 2, 3, 4] as i}
				<button
						type="button"
						class="focus:outline-none"
						onclick={() => selectRating(i + 1)}
						aria-label={`Rate ${i + 1} stars`}
				>
					<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 transition duration-150"
							fill={feedbackData.rating > i ? "currentColor" : "none"}
							stroke="currentColor"
							class:fill-yellow-500={feedbackData.rating > i}
							class:stroke-gray-300={feedbackData.rating <= i}
							stroke-width="1"
							viewBox="0 0 24 24"
					>
						<path
								d="M12 .587l3.668 7.428 8.195 1.174-5.928 5.771 1.398 8.14L12 18.897l-7.333 3.873 1.398-8.14-5.928-5.771 8.195-1.174z"
						/>
					</svg>
				</button>
			{/each}
		</div>
		<p class="text-sm text-gray-500 mt-1">
			Selected: {feedbackData.rating || "No"} star{feedbackData.rating === 1 ? "" : "s"}
		</p>
	</div>

	<!-- Feedback Message -->
	<div>
		<label for="feedbackMessage" class="block text-sm font-medium text-gray-700">
			Your Feedback <span class="text-red-500">*</span>
		</label>
		<textarea
				id="feedbackMessage"
				bind:value={feedbackData.feedbackMessage}
				rows="4"
				class="mt-2 block w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm placeholder-gray-400 px-4 py-2"
				placeholder="Write your feedback here..."
				required
		></textarea>
		<p class="text-sm text-gray-500 mt-1">
			Max 500 characters.
		</p>
	</div>

	<!-- Submit Button -->
	<div class="flex flex-col justify-end text-center">
		<button
				type="submit"
				class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition duration-150 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-300"
				disabled={!$isUserLoggedIn || $isUserAdmin || !validated}
		>
			Submit Feedback
		</button>
		{#if !$isUserLoggedIn}
			<div class="text-sm text-gray-500 mt-1">
				<p>
					You must be logged in to submit feedback.
					<button type="button" onclick={async ()=>{
						modals.closeAll()
						page.redirect("/login")
					}} class="text-blue-500 hover:underline">Login</button>
				</p>

			</div>

		{/if}
		{#if $isUserAdmin}
			<p class="text-sm text-gray-500 mt-1">
				Admins cannot submit feedback.
			</p>
		{/if}
	</div>
</form>
