<script lang="ts">
    import router from 'page';
    import Homepage from "./pages/Homepage.svelte";
    import ModeratorDashboard from "./pages/ModeratorDashboard.svelte";
    import Register from "./pages/Register.svelte";
    import Login from "./pages/Login.svelte";
    import AdminUser from "./pages/AdminUser.svelte";
    import LoggedInUser from "./pages/LoggedInUser.svelte";
    import type {Context} from 'page';
    import isNotLoggedIn from "./lib/middleware/notLoggedIn";
    import isAdmin from "./lib/middleware/isAdmin.js";
    import isLoggedIn from "./lib/middleware/loggedIn";
    import UserDashboard from "./pages/UserDashboard.svelte";
    import { Modals } from 'svelte-modals'
    import Navigation from "./components/Navigation.svelte";

    let page: any;
    let params: Context;
    let currentRoute: string;

    router('/', (ctx: Context) => {
        page = Homepage;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/moderator-dashboard', (ctx) => {
        page = ModeratorDashboard;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/user-dashboard', (ctx) => {
        page = UserDashboard;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/register', isNotLoggedIn, (ctx: Context) => {
        page = Register;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/login', isNotLoggedIn, (ctx: Context) => {
        page = Login;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/test-logged-in', isLoggedIn, (ctx: Context) => {
        page = LoggedInUser;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/test-admin', isAdmin, (ctx: Context) => {
        page = AdminUser;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router.start();
</script>


<main>

    <div class="flex">
        <Navigation currentRoute="{currentRoute}" bind:currentPage={page} ></Navigation>
        <svelte:component this={page} {params}/>
    </div>

    <Modals>
        {#snippet backdrop({ close })}
            <div class="fixed inset-0 z-[999]" onclick={() => close()}>

            </div>
        {/snippet}
    </Modals>
</main>

