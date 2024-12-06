<script lang="ts">
    import {authToken} from "../../lib/stores/auth";
    import {get} from "svelte/store";

    let currentUsername: string = 'current_user'; //this has the pre fill of the current username
    let newUsername: string = '';
    let successMessage: string = '';
    let errorMessage: string = '';

    const handleSubmit = async (): Promise<void> => {
        if (newUsername.trim() === '') {
            errorMessage = "Please enter a new username.";
            return;
        }

        const token = get(authToken);

        if (!token) {
            errorMessage = "Unauthorized. Please log in.";
            return;
        }

        try {
            const response = await fetch('http://localhost:5173/userDashboard/update-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldUsername: currentUsername,
                    newUsername: newUsername
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                successMessage = "Username changed successfully!";
                currentUsername = newUsername;
                newUsername = '';
                errorMessage = '';
            } else {
                errorMessage = result.message || "Failed to update username:((";
            }
        } catch (e) {
            errorMessage = "Network error! Please try again later.";
        }
    };
</script>


<div class="bg-gray-100 p-8 border rounded-lg shadow-md max-w-xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Change Username</h2>
    <p class="mb-6 text-gray-600">Update your username to something recognizable for your account.</p>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
            <label for="currentUsername" class="block mb-2 font-semibold">Current Username</label>
            <input type="text" id="currentUsername" value={currentUsername}
                   class="w-full p-2 mb-4 border rounded bg-gray-200" disabled/>
        </div>

        <div class="mb-4">
            <label for="newUsername" class="block mb-2 font-semibold">New Username</label>
            <input type="text" id="newUsername" bind:value={newUsername} class="w-full p-2 mb-4 border rounded"
                   required/>
        </div>

        {#if errorMessage}
            <p class="text-red-600 mb-4">{errorMessage}</p>
        {/if}

        {#if successMessage}
            <p class="text-green-600 mb-4">{successMessage}</p>
        {/if}

        <button type="submit" class="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">Submit</button>
    </form>
</div>