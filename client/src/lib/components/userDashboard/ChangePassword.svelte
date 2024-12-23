<script lang="ts">
    import {get} from "svelte/store";
    import {authToken} from "../../lib/stores/auth";

    let currentPassword: string = '';
    let newPassword: string = '';
    let confirmPassword: string = '';
    let error: string = '';
    let successMessage: string = '';
    let loading: boolean = false;

    const handleSubmit = async (): Promise<void> => {
        error = '';
        successMessage = '';

        if (loading) return;

        if (newPassword !== confirmPassword) {
            error = "Passwords do not match bro-_-";
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            error = "Password must be at least 6 characters, include one uppercase letter, and one digit.";
            return;
        }

        const token = get(authToken);

        if (!token) {
            error = "Unauthorized. Please log in!!";
            return;
        }

        loading = true;

        try {
            const response = await fetch('http://localhost:5173/userDashboard/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: 'user-id',
                    oldPassword: currentPassword,
                    newPassword: newPassword
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                successMessage = "Password changed successfully!";
                currentPassword = '';
                newPassword = '';
                confirmPassword = '';
            } else {
                error = result.message || "Failed to update password.";
            }
        } catch (e) {
            error = "Network error. Please try again later:((";
        } finally {
            loading = false;
        }
    };

</script>


<div class="bg-gray-100 p-8 border rounded-lg shadow-md max-w-xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Change Password</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
            <label for="currentPassword" class="block mb-2 font-semibold">Current Password</label>
            <input type="password" id="currentPassword" bind:value={currentPassword} class="w-full p-2 border rounded" required />
        </div>

        <div class="mb-4">
            <label for="newPassword" class="block mb-2 font-semibold">New Password</label>
            <input type="password" id="newPassword" bind:value={newPassword} class="w-full p-2 border rounded" required />
        </div>

        <div class="mb-4">
            <label for="confirmPassword" class="block mb-2 font-semibold">Confirm New Password</label>
            <input type="password" id="confirmPassword" bind:value={confirmPassword} class="w-full p-2 border rounded" required />
        </div>

        {#if error}
            <p class="text-red-600 mb-4">{error}</p>
        {/if}
        {#if successMessage}
            <p class="text-green-600 mb-4">{successMessage}</p>
        {/if}
        <button type="submit" class="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
        </button>
    </form>
</div>
