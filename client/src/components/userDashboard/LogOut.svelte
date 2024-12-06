<script lang="ts">
    import {authToken} from "../../lib/stores/auth";

    let showConfirmation: boolean = false;

    const handleLogout = (): void => {
        authToken.set(null);
        window.location.href = '/login';
    };

    const toggleConfirmation = (): void => {
        showConfirmation = !showConfirmation;
    };
</script>

<div class="log-out">
    <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            on:click={toggleConfirmation}
    >
        Log Out
    </button>

    {#if showConfirmation}
        <div class="flex flex-col items-center mt-4 bg-gray-100 p-4 border border-gray-300 rounded shadow">
            <p class="text-gray-700 mb-4">Are you sure you want to log out?</p>
            <div class="flex space-x-2">
                <button
                        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        on:click={handleLogout}
                >
                    Yes, log out
                </button>
                <button
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                        on:click={toggleConfirmation}
                >
                    Cancel
                </button>
            </div>
        </div>
    {/if}
</div>


