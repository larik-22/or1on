<script lang="ts">

    import {writable} from "svelte/store";
    import ChangePassword from "../lib/components/userDashboard/ChangePassword.svelte";
    import ChangeUsername from "../lib/components/userDashboard/ChangeUsername.svelte";
    import LogOut from "../lib/components/userDashboard/LogOut.svelte";

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
