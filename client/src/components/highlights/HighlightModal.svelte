<script lang="ts">
	import {fade} from "svelte/transition";
	import type {ModalProps} from 'svelte-modals'
	import FeedbackList from "./FeedbackList.svelte";
	import FeedbackForm from "./FeedbackForm.svelte";
	import type feedbackFormPayload from "./FeedbackForm.svelte";
	import {fetchWithAuthSvelte} from "../../lib/utils/fetchWithAuth.svelte";
	import {onMount, tick} from "svelte";

	interface HighlightModalProps extends Omit<ModalProps<any>, 'id'> {
		name: string,
		description: string,
		id: number,
	}

	const {isOpen, name, id, description, close}: HighlightModalProps = $props()

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
				errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
		window.addEventListener("keydown", handleKeydown);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
		};
	});
</script>

{#if isOpen}
	{#snippet iconGoBack()}
		<svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gray-200">
			<path class="fill-white" d="M21.75 18.75C21.75 18.9489 21.671 19.1397 21.5303 19.2803C21.3897 19.421 21.1989 19.5 21 19.5C20.8011 19.5 20.6103 19.421 20.4696 19.2803C20.329 19.1397 20.25 18.9489 20.25 18.75C20.2475 16.5627 19.3775 14.4657 17.8309 12.9191C16.2842 11.3725 14.1873 10.5025 12 10.5H4.81029L8.03061 13.7194C8.17134 13.8601 8.2504 14.051 8.2504 14.25C8.2504 14.449 8.17134 14.6399 8.03061 14.7806C7.88987 14.9213 7.699 15.0004 7.49998 15.0004C7.30096 15.0004 7.11009 14.9213 6.96935 14.7806L2.46935 10.2806C2.39962 10.211 2.3443 10.1282 2.30656 10.0372C2.26882 9.94615 2.24939 9.84855 2.24939 9.74999C2.24939 9.65143 2.26882 9.55383 2.30656 9.46278C2.3443 9.37174 2.39962 9.28902 2.46935 9.21936L6.96935 4.71936C7.11009 4.57863 7.30096 4.49957 7.49998 4.49957C7.699 4.49957 7.88987 4.57863 8.03061 4.71936C8.17134 4.8601 8.2504 5.05097 8.2504 5.24999C8.2504 5.44901 8.17134 5.63988 8.03061 5.78061L4.81029 8.99999H12C14.585 9.00272 17.0634 10.0308 18.8913 11.8587C20.7191 13.6866 21.7472 16.165 21.75 18.75Z"
				  fill=""/>
		</svg>
	{/snippet}

	<div
			role="dialog"
			class="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center backdrop-filter bg-black bg-opacity-40 backdrop-blur-md "
			transition:fade|global={{duration: 300}}
	>
		<!-- The Modal -->
		<div class="bg-white rounded-md shadow-lg w-full max-w-3xl pointer-events-auto overflow-y-auto overflow-x-hidden max-h-[650px] py-4">
			<div class="px-4 flex justify-end sticky top-1">
				<button
						class="transition-colors duration-300 bg-red-500 hover:bg-red-200 text-gray-200 px-2 py-1 rounded-lg flex items-center gap-1"
						onclick={() => close()}
				>
					{@render iconGoBack()}
					Close
				</button>
			</div>
			<div class="p-4 border-b">
				<h2 class="text-xl font-medium mb-2">{name}</h2>
				<p>{description}</p>
			</div>
			<!-- Feedback list & form -->
			{#await feedbackPromise}
				<div class="p-4 border-t">
					<p>Loading... I am gonna be a spinning icon one day</p>
				</div>
			{:then data}
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
				<div class="mx-4 mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded" bind:this={errorElement}>
					<p>{submissionError}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}