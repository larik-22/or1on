<script lang="ts">
    import { updateUsernameSchema } from "../../schema/updateUsernameSchema";
    import {authToken, decodeToken} from "../../stores/auth";
    import {get} from "svelte/store";
    import { setToken } from "../../utils/authHandler.svelte";

    // Get the current username from the token
    let username: string | null = decodeToken(get(authToken))?.username ?? null;

    let formData = $state({
        currentUsername: username || "current_user", // Use decoded username or fallback
        newUsername: "",
    });

    let errors: Record<string, string[]> = $state({});
    let isSubmitting = $state(false);

    /**
     * Handle form submission for updating the username.
     * Validates input, sends the request to the backend, and manages success or error states.
     * @param e - The form submission event.
     */
    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        // Validate the form data using schema
        const result = updateUsernameSchema.safeParse(formData);
        if (!result.success) {
            errors = result.error.flatten().fieldErrors;
            return;
        }

        errors = {};
        isSubmitting = true;

        try {
            const token = get(authToken);
            if (!token) {
                errors = {message: ["Unauthorized. Please log in."]};
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/userDashboard/update-username`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldUsername: formData.currentUsername,
                    newUsername: formData.newUsername,
                }),
            });

            let result = await response.json();

            setToken(result.token);

            if (response.ok && result.success) {
                alert("Username changed successfully!^^");
                formData.newUsername = "";

                formData.currentUsername = decodeToken(result.token)?.username ?? ""; // update the shown username
            }
        } catch(error) {
            errors = {message: ["An unexpected error occurred. Please try again."]};
            console.log(error)
        } finally {
            isSubmitting = false;
        }
    };
</script>


<div class="flex bg-gray-100 h-screen">
    <div
            class="absolute bg-white p-6 border rounded-lg shadow-md w-full max-w-sm"
            style="top: 50%; left: 55%; transform: translate(-50%, -50%);"
    >
        <h2 class="text-2xl font-semibold mb-4 text-center">Change Username</h2>
        <form onsubmit={handleSubmit}>
            <div class="mb-4">
                <label for="username" class="block mb-2 font-semibold">Current Username</label>
                <input
                        id="username"
                        type="text"
                        value={formData.currentUsername}
                        class="w-full p-2 border rounded bg-gray-200"
                        readonly
                />
            </div>

            <div class="mb-4">
                <label for="newUsername" class="block mb-2 font-semibold">New Username</label>
                <input
                        id="newUsername"
                        type="text"
                        bind:value={formData.newUsername}
                        class="w-full p-2 border rounded"
                        required
                />
                {#if errors.newUsername}
                    <p class="text-red-600 text-sm">{errors.newUsername[0]}</p>
                {/if}
            </div>

            {#if errors.message}
                <p class="text-red-600 mb-4 text-sm text-center">{errors.message[0]}</p>
            {/if}

            <button
                    type="submit"
                    class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                    disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    </div>
</div>

