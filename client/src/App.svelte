<script lang="ts">
    import router from 'page';
    import Homepage from "./pages/Homepage.svelte";
    import ModeratorDashboard from "./pages/ModeratorDashboard.svelte";
    import Register from "./pages/Register.svelte";
    import Login from "./pages/Login.svelte";
    import type {Context} from 'page';
    import isNotLoggedIn from "./lib/middleware/notLoggedIn";
    import isAdmin from "./lib/middleware/isAdmin.js";
    import isLoggedIn from "./lib/middleware/loggedIn";
    import UserDashboard from "./pages/UserDashboard.svelte";
    import { Modals } from 'svelte-modals'
    import Navigation from "./lib/components/Navigation.svelte";
    import TestHomepage from "./pages/TestHomepage.svelte";
    import SuggestHighlight from "./pages/SuggestHighlight.svelte";

    let page: any;
    let params: Context;
    let currentRoute: string;

    router('/', (ctx: Context) => {
        page = Homepage;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/test', (ctx: Context) => {
        page = TestHomepage;
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

    router('/user-dashboard', isLoggedIn, (ctx) => {
        page = UserDashboard;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/suggest-highlight', isLoggedIn, (ctx) => {
        page = SuggestHighlight;
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

