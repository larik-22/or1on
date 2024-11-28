<script lang="ts">

</script>

<div class="homepage-container flex flex-col items-center justify-center h-screen">
	<h1 class="text-3xl font-bold mb-4">Welcome to Deventer on Tour!</h1>
	<p class="mb-8 text-lg">Your ultimate guide to the best tours in Deventer.</p>

	<!-- My Account Button -->
	<button on:click={navigateToDashboard} class="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
		My Account
	</button>
</div>

<style>
	.homepage-container {
		font-family: Arial, sans-serif;
	}
</style>