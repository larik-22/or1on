<script lang="ts">
    import ChangePassword from "../components/userDashboard/ChangePassword.svelte";
    import ChangeUsername from "../components/userDashboard/ChangeUsername.svelte";
    import LogOut from "../components/userDashboard/LogOut.svelte";
    import BurgerBar from "../components/burgerBar/BurgerBar.svelte";
    import {writable} from "svelte/store";

    let currentSection = writable('');

    let BarItems: Array<[string, { label: string, action: () => void }[]]> = [
        ["User Dashboard",
            [
                {
                    label: "Change Password",
                    action: () => {
                        currentSection.set('Change Password');
                    }
                },
                {
                    label: "Change Username",
                    action: () => {
                        currentSection.set('Change Username');
                    }
                },
                {
                    label: "Log Out",
                    action: () => {
                        currentSection.set('Log Out');
                    }
                }
            ]
        ]
    ];
</script>

<main class="flex h-screen">
    <!-- Sidebar -->
    <div class="bg-gray-200 border-r border-gray-300 min-w-[320px] w-[15vw]">
        <div class="text-center mb-6 ">
            <img src="/path/to/profile-pic.jpg" alt="Profile Picture"
                 class="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-300" />
            <h3 class="text-xl font-semibold text-gray-800">Hello, Username</h3>
        </div>
        <!-- Navigation items using BurgerBar -->
        <BurgerBar BarItems={BarItems} Location="User Dashboard" />
    </div>

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
