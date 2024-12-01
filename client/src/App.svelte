<script lang="ts">
    import router from 'page';
    import Homepage from "./pages/Homepage.svelte";
    import ModeratorDashboard from "./pages/ModeratorDashboard.svelte";
    import Register from "./pages/Register.svelte";
    import Navigation from "./lib/Navigation.svelte";
    import Login from "./pages/Login.svelte";
    import AdminUser from "./pages/AdminUser.svelte";
    import LoggedInUser from "./pages/LoggedInUser.svelte";
    import type {Context} from 'page';
    import isNotLoggedIn from "./middleware/notLoggedIn";
    import isAdmin from "./middleware/isAdmin.js";
    import isLoggedIn from "./middleware/loggedIn";

    import UserDashboard from "./pages/userDashboard/UserDashboard.svelte";
    import ChangePassword from "./pages/userDashboard/ChangePassword.svelte";
    import ChangeUsername from "./pages/userDashboard/ChangeUsername.svelte";
    import LogOut from "./pages/userDashboard/LogOut.svelte";


    let page: any;
    let params: Context;
    let currentRoute: string;

    router('/', (ctx: Context) => {
        page = Homepage;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/admin', (ctx) => {
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

    router('/change-password', (ctx) => {
        page = ChangePassword;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/login', isNotLoggedIn, (ctx: Context) => {
        page = Login;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/change-username', (ctx) => {
        page = ChangeUsername;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/test-logged-in', isLoggedIn, (ctx: Context) => {
        page = LoggedInUser;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/logout', (ctx) => {
        page = LogOut;
        currentRoute = ctx.pathname;
        params = ctx;
    });

    router('/test-admin', isAdmin, (ctx: Context) => {
        page = AdminUser;
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
    <Navigation active={currentRoute}/>

    <p class="text-yellow-500">Tailwind Works</p>
    <svelte:component this={page} {params}/>
</main>

<style>
    main {
        padding: 20px;
    }
</style>
