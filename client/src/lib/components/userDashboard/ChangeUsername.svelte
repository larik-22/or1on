<script lang="ts">
    import {updateUsernameSchema} from "../../schema/updateUsernameSchema";
    import {authToken} from "../../stores/auth";
    import {get} from "svelte/store";

    let formData = $state({
        currentUsername: "current_user",
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
            } else {
                errors = {message: [result.message || "Failed to update username:("]};
            }
        } catch{
            errors = {message: ["An unexpected error occurred. Please try again."]};
        } finally {
            isSubmitting = false;
        }
    };
</script>


<form onsubmit={handleSubmit} class="flex flex-col gap-4">
    <label>
        <span class="text-gray-500 select-none text-xs">Current Username</span>
        <input type="text" value={formData.currentUsername} readonly />
    </label>

    <label>
        <span class="text-gray-500 select-none text-xs">New Username</span>
        <input type="text" bind:value={formData.newUsername} required />
        {#if errors.newUsername}
            <p class="text-red-600">{errors.newUsername[0]}</p>
        {/if}
    </label>

    {#if errors.message}
        <p class="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative mt-1.5 text-xs text-center">
            {errors.message}
        </p>
    {/if}

    <button type="submit" disabled={isSubmitting} class="bg-blue-500 text-white px-4 py-2 rounded">
        {isSubmitting ? "Submitting..." : "Change Username"}
    </button>
</form>