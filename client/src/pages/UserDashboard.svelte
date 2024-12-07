<script lang="ts">
    import ChangePassword from "../components/userDashboard/ChangePassword.svelte";
    import ChangeUsername from "../components/userDashboard/ChangeUsername.svelte";
    import LogOut from "../components/userDashboard/LogOut.svelte";
    import BurgerBar from "../components/burgerBar/BurgerBar.svelte";
    import {writable} from "svelte/store";

    let currentSection = writable('');
</script>

<main class="flex h-screen">
    <!-- Sidebar -->

    <!-- Main Content Area -->
    <div class="flex-grow p-8">
        {#if $currentSection === 'Change Password'}
            <ChangePassword />
        {/if}

        {#if $currentSection === 'Change Username'}
            <ChangeUsername />
        {/if}

        {#if $currentSection === 'Log Out'}
            <LogOut />
        {/if}
    </div>
</main>
