<script lang="ts">
    let currentUsername: string = 'current_user'; //this has the pre fill of the current username
    let newUsername: string = '';
    let successMessage: string = '';
    let errorMessage: string = '';

    const handleSubmit = (): void => {
        if (newUsername.trim() === '') {
            errorMessage = "Please enter a new username.";
            successMessage = '';
        } else {
            //successful username change
            console.log("Username changed to: ", newUsername);
            successMessage = "Username changed successfully!";
            errorMessage = '';
            //clear input after successful change
            currentUsername = newUsername;
            newUsername = '';
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