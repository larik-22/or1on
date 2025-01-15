<script lang="ts">
    import router from 'page';
    import Homepage from "./pages/Homepage.svelte";
    import Register from "./pages/Register.svelte";
    import Login from "./pages/Login.svelte";
    import type {Context} from 'page';
    import isNotLoggedIn from "./lib/middleware/notLoggedIn";
    import isAdmin from "./lib/middleware/isAdmin.js";
    import isLoggedIn from "./lib/middleware/loggedIn";
    import UserDashboard from "./pages/UserDashboard.svelte";
    import {Modals} from 'svelte-modals'
    import Navigation from "./lib/components/Navigation.svelte";
    import SuggestHighlight from "./pages/SuggestHighlight.svelte";
    import UserFeedbacks from "./pages/UserFeedbacks.svelte";
    import UserManagement from "./lib/components/moderatorDashboard/UserManagement.svelte";
    import ChangePassword from "./lib/components/userDashboard/ChangePassword.svelte";
    import ChangeUsername from "./lib/components/userDashboard/ChangeUsername.svelte";
    import LogOut from "./lib/components/userDashboard/LogOut.svelte";
    import Feedback from "./pages/Feedback.svelte";
    import Tours from "./pages/Tours.svelte";
    import MyHighlights from "./pages/MyHighlights.svelte";
    import TourPage from "./pages/TourPage.svelte";
    import ToursManage from "./lib/components/moderatorDashboard/ToursManage.svelte";
    import HighlightsManage from "./lib/components/moderatorDashboard/HighlightsManage.svelte";
    import HighlightSuggestion from "./lib/components/moderatorDashboard/HighlightSuggestion.svelte";

    let page: any = $state(Homepage);
    let params: Context = $state();
    let currentRoute: string = $state("/");


    let showSideBar: boolean = $state(false);
    let buttonText: string = $state("+");
    let timer: number = $state(0);
    let innerWidth: number = $state(window.innerWidth);

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

    router('/my-highlights', isLoggedIn, (ctx: Context) => {
        page = MyHighlights;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/moderator-dashboard', isAdmin, (ctx) => {
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/user-dashboard', isLoggedIn, (ctx) => {
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
    });

    router('/user-management', isLoggedIn, isAdmin, (ctx) => {
        page = UserManagement;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/change-password', isLoggedIn, (ctx) => {
        page = ChangePassword;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/change-username', isLoggedIn, (ctx) => {
        page = ChangeUsername;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/logout', isLoggedIn, (ctx) => {
        page = LogOut;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/feedbacks-management', isLoggedIn, isAdmin, (ctx) => {
        page = Feedback;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/manage-tours', isLoggedIn, isAdmin, (ctx) => {
        page = ToursManage;
        currentRoute = ctx.pathname;
        params = ctx;
    })

    router('/manage-highlights', isLoggedIn, isAdmin, (ctx) => {
        page = HighlightsManage;
        currentRoute = ctx.pathname;
        params = ctx;
    })

    router('/manage-suggestions', isLoggedIn, isAdmin, (ctx) => {
        page = HighlightSuggestion;
        currentRoute = ctx.pathname;
        params = ctx;
    })





    router.start();

</script>

<svelte:window bind:innerWidth={innerWidth}/>

<main>

    <div class="flex">
        {#if innerWidth < 640}
            <div class="sm:block hidden" class:showSideBar={showSideBar}>
                <Navigation FullWidth={true} currentRoute={currentRoute} bind:currentPage={page}></Navigation>
            </div>
            <button type="button"
                    class="absolute right-5 top-[3vh] z-[999] text-[30px] text-[black] bg-gray-50 pl-[15px] pr-[15px] rounded-[5px] sm:hidden"
                    onclick={()=>{

                clearTimeout(timer);
                timer = setTimeout(()=>{
                    showSideBar = !showSideBar;
                    switch (buttonText) {
                        case "+" :
                            buttonText = "x";
                            break;
                        case "x" :
                            buttonText = "+";
                            break;
                    }
                },50)


        }}>{buttonText}</button>
        {:else}
            <Navigation FullWidth={false} currentRoute={currentRoute} bind:currentPage={page}></Navigation>
        {/if}

<!--        eslint-disable-next-line-->
        <svelte:component this={page} {params}/>
    </div>

    <Modals>
        {#snippet backdrop({close})}
        <div
                role="button"
                tabindex="0"
                class="fixed inset-0 z-[999]"
                onclick={() => close()}
                onkeypress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      close();
    }
  }}>
        </div>
        {/snippet}
    </Modals>
</main>

<style>
    .showSideBar {
        display: block;
        position: absolute;
        z-index: 900;
    }


</style>

