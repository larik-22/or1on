<script lang="ts">
    import { updateUsernameSchema } from "../../lib/schema/updateUsernameSchema";
    import { authToken, decodeToken } from "../../lib/stores/auth";
    import {get} from "svelte/store";

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

        // Clear errors and set submitting state
        errors = {};
        isSubmitting = true;

        try {
            const token = get(authToken);
            if (!token) {
                errors = {message: ["Unauthorized. Please log in."]};
                return;
            }

            // Make the API call to update the username
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

            // Handle the API response
            const result = await response.json();
            if (response.ok && result.success) {
                alert("Username changed successfully!^^");
                formData.newUsername = "";
                username = formData.currentUsername = result.newUsername; // update the shown username
            } else {
                errors = {message: [result.message || "Failed to update username:("]};
            }
        } catch {
            errors = {message: ["An unexpected error occurred. Please try again."]};
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
                <label class="block mb-2 font-semibold">Current Username</label>
                <input
                        type="text"
                        value={formData.currentUsername}
                        class="w-full p-2 border rounded bg-gray-200"
                        readonly
                />
            </div>

            <div class="mb-4">
                <label class="block mb-2 font-semibold">New Username</label>
                <input
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


