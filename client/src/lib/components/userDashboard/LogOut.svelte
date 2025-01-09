<script lang="ts">
    import {logout} from "../../utils/authHandler.svelte";
    import { onMount} from "svelte";

    let showConfirmation = false;

    const handleLogout = (): void => {
        showConfirmation = true;
    };

    const confirmLogout = (): void => {
        logout(); // using the logout function from authHandler
    };

    const cancelLogout = (): void => {
        showConfirmation = false;
    };

    onMount(() => {
    });
</script>

<div class="bg-gray-100 p-8 border rounded-lg shadow-md max-w-xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Logout</h2>
    <p class="mb-6 text-gray-600">Click the button below to log out of your account securely.</p>

    {#if showConfirmation}
        <!-- Confirmation dialog shown when user clicks "Log Out" -->
        <div class="bg-red-100 p-4 border rounded">
            <p class="text-red-600 mb-4">Are you sure you want to log out?</p>
            <button
                    class="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 mr-2"
                    on:click={confirmLogout}>
                Confirm
            </button>
            <button
                    class="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
                    on:click={cancelLogout}>
                Cancel
            </button>
        </div>
    {:else}
        <!-- regular Log Out button -->
        <button
                class="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                on:click={handleLogout}>
            Log Out
        </button>
    {/if}
</div>