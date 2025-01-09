<script lang="ts">
    import {updatePasswordSchema} from "../../schema/updatePasswordSchema";
    import {get} from "svelte/store";
    import {authToken} from "../../stores/auth";

    let formData = $state({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // states for error msgs and submission status
    let errors: Record<string, string[]> = $state({});
    let isSubmitting = $state(false);

    /**
     * Handle form submission for updating the password.
     * Validates input, sends the request to the backend, and manages success or error states.
     * @param e - The form submission event.
     */
    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        // validate the form data using schema
        const result = updatePasswordSchema.safeParse(formData);
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
                errors = { message: ["Unauthorized. Please log in."] };
                return;
            }

            // Make the API call to update the password
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/userDashboard/update-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            // Handle the API response
            const result = await response.json();
            if (response.ok && result.success) {
                alert("Password changed successfully!");
                formData = { currentPassword: "", newPassword: "", confirmPassword: "" };
            } else {
                errors = { message: [result.message || "Failed to update password."] };
            }
        } catch {
            errors = { message: ["An unexpected error occurred. Please try again."] };
        } finally {
            isSubmitting = false;
        }
    };

</script>


<form onsubmit={handleSubmit} class="flex flex-col gap-4">
    <label>
        <span class="text-gray-500 select-none text-xs">Current Password</span>
        <input type="password" bind:value={formData.currentPassword} required />
        {#if errors.currentPassword}
            <p class="text-red-600">{errors.currentPassword[0]}</p>
        {/if}
    </label>

    <label>
        <span class="text-gray-500 select-none text-xs">New Password</span>
        <input type="password" bind:value={formData.newPassword} required />
        {#if errors.newPassword}
            <p class="text-red-600">{errors.newPassword[0]}</p>
        {/if}
    </label>

    <label>
        <span class="text-gray-500 select-none text-xs">Confirm New Password</span>
        <input type="password" bind:value={formData.confirmPassword} required />
        {#if errors.confirmPassword}
            <p class="text-red-600">{errors.confirmPassword[0]}</p>
        {/if}
    </label>

    {#if errors.message}
        <p class="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative mt-1.5 text-xs text-center">
            {errors.message}
        </p>
    {/if}

    <button type="submit" disabled={isSubmitting} class="bg-blue-500 text-white px-4 py-2 rounded">
        {isSubmitting ? "Submitting..." : "Change Password"}
    </button>
</form>