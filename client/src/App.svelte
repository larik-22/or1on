<script lang="ts">
	import router  from 'page';
	import Homepage from "./pages/Homepage.svelte";
	import UserDashboard from "./pages/userDashboard/UserDashboard.svelte";
	import ChangePassword from "./pages/userDashboard/ChangePassword.svelte";
	import ChangeUsername from "./pages/userDashboard/ChangeUsername.svelte";
	import LogOut from "./pages/userDashboard/LogOut.svelte";


	let page: any;
	let params: any;
	let currentRoute: string;

	router('/', (ctx) => {
		page = Homepage;
		currentRoute = ctx.pathname;
		params = ctx;
	});

	router('/user-dashboard', (ctx) => {
		page = UserDashboard;
		currentRoute = ctx.pathname;
		params = ctx;
	});

	router('/change-password', (ctx) => {
		page = ChangePassword;
		currentRoute = ctx.pathname;
		params = ctx;
	});

	router('/change-username', (ctx) => {
		page = ChangeUsername;
		currentRoute = ctx.pathname;
		params = ctx;
	});

	router('/logout', (ctx) => {
		page = LogOut;
		currentRoute = ctx.pathname;
		params = ctx;
	});

	router.start();
</script>


<main>
	<p class="text-yellow-500">Tailwind Works</p>
	<svelte:component this={page} {params}/>
</main>

<style>
	main {
		padding: 20px;
	}
</style>
