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

            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload

            const userId = payload.id; // Ensure `userId` exists in the token payload

            // Make the API call to update the password
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/userDashboard/update-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
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


<div class="flex bg-gray-100 h-screen">
    <div
            class="absolute bg-white p-6 border rounded-lg shadow-md w-full max-w-sm"
            style="top: 50%; left: 55%; transform: translate(-50%, -50%);"
    >
        <h2 class="text-2xl font-semibold mb-4 text-center">Change Password</h2>
        <form onsubmit={handleSubmit}>
            <div class="mb-4">
                <label class="block mb-2 font-semibold">Current Password</label>
                <input
                        type="password"
                        bind:value={formData.currentPassword}
                        class="w-full p-2 border rounded"
                        required
                />
                {#if errors.currentPassword}
                    <p class="text-red-600 text-sm">{errors.currentPassword[0]}</p>
                {/if}
            </div>

            <div class="mb-4">
                <label class="block mb-2 font-semibold">New Password</label>
                <input
                        type="password"
                        bind:value={formData.newPassword}
                        class="w-full p-2 border rounded"
                        required
                />
                {#if errors.newPassword}
                    <p class="text-red-600 text-sm">{errors.newPassword[0]}</p>
                {/if}
            </div>

            <div class="mb-4">
                <label class="block mb-2 font-semibold">Confirm New Password</label>
                <input
                        type="password"
                        bind:value={formData.confirmPassword}
                        class="w-full p-2 border rounded"
                        required
                />
                {#if errors.confirmPassword}
                    <p class="text-red-600 text-sm">{errors.confirmPassword[0]}</p>
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