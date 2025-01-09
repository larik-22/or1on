<script lang="ts">
    import { logout } from "../../lib/utils/authHandler.svelte";
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

<div class="flex bg-gray-100 h-screen">
    <div
            class="absolute bg-white p-6 border rounded-lg shadow-md w-full max-w-sm"
            style="top: 50%; left: 55%; transform: translate(-50%, -50%);"
    >
        <h2 class="text-2xl font-semibold mb-4 text-center">Logout</h2>
        <p class="mb-6 text-gray-600 text-center">
            Click the button below to log out of your account securely.
        </p>

        {#if showConfirmation}
            <!-- Confirmation dialog -->
            <div class="bg-red-50 p-4 border rounded-lg">
                <p class="text-red-600 text-center mb-4">
                    Are you sure you want to log out?
                </p>
                <div class="flex justify-between">
                    <button
                            class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full mr-2"
                            on:click={confirmLogout}
                    >
                        Confirm
                    </button>
                    <button
                            class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-full"
                            on:click={cancelLogout}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        {:else}
            <!-- Log Out button -->
            <button
                    class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800 w-full"
                    on:click={handleLogout}
            >
                Log Out
            </button>
        {/if}
    </div>
</div>
