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
    import SuggestHighlight from "./pages/SuggestHighlight.svelte";
    import UserFeedbacks from "./pages/UserFeedbacks.svelte";
    import UserManagement from "./lib/components/moderatorDashboard/UserManagement.svelte";
    import ChangePassword from "./lib/components/userDashboard/ChangePassword.svelte";
    import ChangeUsername from "./lib/components/userDashboard/ChangeUsername.svelte";
    import LogOut from "./lib/components/userDashboard/LogOut.svelte";
    import Feedback from "./pages/Feedback.svelte";
    import Tours from "./pages/Tours.svelte";
    import TourPage from "./pages/TourPage.svelte";

    let page: any;
    let params: Context;
    let currentRoute: string;

    router('/', (ctx: Context) => {
        page = Homepage;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/tours', (ctx: Context) => {
        page = Tours;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router("/tours/:id", (ctx: Context) => {
        page = TourPage;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/moderator-dashboard', isAdmin, (ctx) => {
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

    router('/feedbacks', isLoggedIn, (ctx) => {
        page = UserFeedbacks;
        currentRoute = ctx.pathname;
        params = ctx;
    })

    router('/user-management', isLoggedIn, isAdmin, (ctx) => {
        page = UserManagement;
        currentRoute = ctx.pathname;
        params = ctx;
    })

    router('/change-password', isLoggedIn, (ctx) => {
        page = ChangePassword;
        currentRoute = ctx.pathname;
        params = ctx;
    })

    router('/change-username', isLoggedIn, (ctx) => {
        page = ChangeUsername;
        currentRoute = ctx.pathname;
        params = ctx;
    })

    router('/logout', isLoggedIn, (ctx) => {
        page = LogOut;
        currentRoute = ctx.pathname;
        params = ctx;
    })

    router('/feedbacks-management', isLoggedIn, isAdmin, (ctx) => {
        page = Feedback;
        currentRoute = ctx.pathname;
        params = ctx;
    })


    router.start();
</script>


<main>

    <div class="flex">
        <Navigation currentRoute="{currentRoute}" bind:currentPage={page} ></Navigation>
        <svelte:component this={page} {params}/>
    </div>

    <Modals>
        {#snippet backdrop({ close })}
        <div
                role="button"
                tabindex="0"
                class="fixed inset-0 z-[999]"
                on:click={() => close()}
                on:keypress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      close();
    }
  }}
        >
        </div>
        {/snippet}
    </Modals>
</main>

