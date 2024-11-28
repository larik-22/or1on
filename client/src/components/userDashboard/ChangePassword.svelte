<script>
    let currentPassword = '';
    let newPassword = '';
    let confirmPassword = '';
    let error = '';

    const handleSubmit = () => {
        if (newPassword !== confirmPassword) {
            error = "Passwords do not match!";
        } else if (newPassword.length < 5) {
            error = "Password must be at least 5 characters long!";
        } else {
            // Call to backend (for now just log)
            console.log("Password changed successfully!");
            currentPassword = '';
            newPassword = '';
            confirmPassword = '';
            error = '';
        }
    };
</script>

<div class="bg-gray-100 p-8 border rounded-lg shadow-md max-w-xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Change Password</h2>
    <p class="mb-6 text-gray-600">Ensure your new password is strong and unique. Make sure to follow the security guidelines.</p>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
            <label for="currentPassword" class="block mb-2 font-semibold">Current Password</label>
            <input type="password" id="currentPassword" bind:value={currentPassword} class="w-full p-2 mb-4 border rounded" required />
        </div>

        <div class="mb-4">
            <label for="newPassword" class="block mb-2 font-semibold">New Password</label>
            <input type="password" id="newPassword" bind:value={newPassword} class="w-full p-2 mb-4 border rounded" required />
        </div>

        <div class="mb-4">
            <label for="confirmPassword" class="block mb-2 font-semibold">Confirm New Password</label>
            <input type="password" id="confirmPassword" bind:value={confirmPassword} class="w-full p-2 mb-4 border rounded" required />
        </div>

        {#if error}
            <p class="text-red-600 mb-4">{error}</p>
        {/if}

        <button type="submit" class="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">Submit</button>
    </form>
</div>

