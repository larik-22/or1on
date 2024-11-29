<script lang="ts">
	import router  from 'page';
	import Homepage from "./pages/Homepage.svelte";
	import ModeratorDashboard from "./pages/ModeratorDashboard.svelte";

	let page: any;
	let params: any;
	let currentRoute: string;

	router('/', (ctx) => {
		page = Homepage;
		currentRoute = ctx.pathname;
		params = ctx;
	});
	router('/admin', (ctx)=> {
		page = ModeratorDashboard;
		currentRoute = ctx.pathname;
		params = ctx;
	});

	router.start();
</script>


<main>
	<!--Put navigation here-->
	<!--<p class="text-yellow-500">Tailwind Works</p>-->
	<svelte:component this={page} {params}/>
</main>


