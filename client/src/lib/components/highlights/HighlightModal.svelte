<script lang="ts">
	import {fade} from "svelte/transition";
	import type {ModalProps} from 'svelte-modals'
	import FeedbackList from "./FeedbackList.svelte";
	import type feedbackFormPayload from "./FeedbackForm.svelte";
	import FeedbackForm from "./FeedbackForm.svelte";
	import {fetchWithAuthSvelte} from "../../utils/fetchWithAuth.svelte.js";
	import {onMount, tick} from "svelte";

	interface HighlightModalProps extends Omit<ModalProps<any>, 'id'> {
		name: string,
		description: string,
		businessOffer: string | null,
		id: number,
	}

	const {isOpen, name, id, description, businessOffer, close}: HighlightModalProps = $props()

	// promise, that will trigger the re-render
	let feedbackPromise: Promise<any> | null = $state(null);

	// Error message
	let submissionError: string | null = $state(null);
	let errorElement: HTMLDivElement | null = $state(null);

	// Cache name
	const cacheName = 'highlight-feedback-cache';

	/**
	 * Fetch feedback from the server and cache it for 5 minutes
	 * @returns {Promise<any>} - The feedback data
	 */
	const fetchFeedback = async () => {
		try {
			const cache = await caches.open(cacheName);
			const cacheKey = `${import.meta.env.VITE_BACKEND_URL}/highlights/${id}/feedbacks`;
			const cachedResponse = await cache.match(cacheKey);

			if (cachedResponse) {
				const cachedData = await cachedResponse.json();
				const cachedTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
				const now = new Date();

				// Check if cache is still valid (5 minutes)
				if ((now.getTime() - cachedTime.getTime()) < 5 * 60 * 1000) {
					console.log('Using cached data');
					return cachedData;
				}
			}
			// Fetch from network
			const response = await fetch(cacheKey);
			const data = await response.json();

			// Cache the new response
			const headers = new Headers(response.headers);
			headers.set('sw-cache-time', new Date().toISOString());
			const cacheResponse = new Response(JSON.stringify(data), {headers});
			await cache.put(cacheKey, cacheResponse);

			return data;
		} catch (err) {
			return [];
		}
	}

	/**
	 * Post feedback to the server and re-render.
	 * If promise fails, error is displayed
	 * @param formData - The feedback form data
	 */
	const handleFeedbackSubmit = async (formData: feedbackFormPayload) => {
		try {
			submissionError = null;

			const data = await fetchWithAuthSvelte(`${import.meta.env.VITE_BACKEND_URL}/highlights/${id}/feedbacks`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(formData),
			});

			const response = await data.json();

			// Reassign the promise to refetch feedback
			feedbackPromise = fetchFeedback();
		} catch (err) {
			submissionError = (err as Error).message || 'Failed to submit feedback. Please try again.';

			// Scroll to the error message
			await tick();

			if (errorElement) {
				errorElement.scrollIntoView({behavior: 'smooth', block: 'center'});
			}
		}
	};

	/**
	 * Allows closing the modal with the escape key
	 * @param event
	 */
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === "Escape" && isOpen) {
			close();
		}
	};

	// Add and clean up event listener
	onMount(() => {
		feedbackPromise = fetchFeedback();

		window.addEventListener("keydown", handleKeydown);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
		};
	});
</script>

{#if isOpen}

	{#snippet iconGoBack()}
		<svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
			 class="text-gray-200">
			<path class="fill-white" d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
				  stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	{/snippet}

	<div
			role="dialog"
			class="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center backdrop-filter bg-black bg-opacity-40 backdrop-blur-md "
			transition:fade|global={{duration: 300}}
	>
		<!-- The Modal -->
		<div class="bg-white rounded-md shadow-lg w-full max-w-3xl pointer-events-auto overflow-y-auto overflow-x-hidden max-h-[650px] pb-4 relative">
			<!-- Close Button -->
			<div class="px-4 flex justify-end sticky top-3">
				<button
						class="transition-colors duration-300 bg-red-500 hover:bg-red-200 text-gray-200 px-2 py-1 rounded-lg flex items-center gap-1"
						onclick={() => close()}
				>
					{@render iconGoBack()}
					Close
				</button>
			</div>
			<!-- Business Offer -->
			{#if businessOffer}
				<div class="p-4 bg-yellow-100 border-b border-yellow-300 rounded-md shadow-sm mt-[-2rem]">
					<p class="text-yellow-800 font-semibold">Business Offer</p>
					<p class="text-yellow-700 mt-1">{businessOffer}</p>
				</div>
			{/if}
			<div class="p-4 border-b">
				<h2 class="text-xl font-medium mb-2">{name}</h2>
				<p>{description}</p>
			</div>
			{#await feedbackPromise}
				<div class="p-4 border-t">
					<p>Loading... I am gonna be a spinning icon one day</p>
				</div>
			{:then data}
				<!-- Back Button -->
				<FeedbackList {data}/>
				<FeedbackForm
						formSubmitted={handleFeedbackSubmit}
				/>
			{:catch error}
				<div class="mx-4 mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
					<p>Couldn't load feedback data...</p>
				</div>
			{/await}

			<!-- Error message -->
			{#if submissionError}
				<div class="mx-4 mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded"
					 bind:this={errorElement}>
					<p>{submissionError}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}