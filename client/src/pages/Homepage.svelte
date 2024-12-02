<script lang="ts">
	//track which section of the dashboard is displayed
	import {writable} from "svelte/store";

	//track which section of the dashboard is displayed
	let currentSection = writable('welcome');

	const showSection = (sectionName: string) => {
		currentSection.set(sectionName);
	};
</script>

<div class="homepage-container flex flex-col items-center justify-center h-screen">
	<h1 class="text-3xl font-bold mb-4">Welcome to Deventer on Tour!</h1>
	<p class="mb-8 text-lg">Your ultimate guide to the best tours in Deventer.</p>

	<main class="main-content">
		{#if $currentSection === 'welcome'}
			<div class="welcome-section">
				<h1>Welcome to Your Dashboard</h1>
				<p>Use the options on the left to update your account information.</p>
			</div>
		{/if}
	</main>
</div>

<style>

</style>