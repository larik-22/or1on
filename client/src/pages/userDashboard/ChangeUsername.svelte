<script>
    let currentUsername = 'current_user'; //this has the pre fill of the current username
    let newUsername = '';
    let successMessage = '';
    let errorMessage = '';

    const handleSubmit = () => {
        if (newUsername.trim() === '') {
            errorMessage = "Please enter a new username.";
            successMessage = '';
        } else {
            // Simulate successful username change
            console.log("Username changed to: ", newUsername);
            successMessage = "Username changed successfully!";
            errorMessage = '';
            // Clear input after successful change
            currentUsername = newUsername;
            newUsername = '';
        }
    };
</script>


<div class="change-username-container">
    <h1>Change Username</h1>
    <p>Update your username to something recognizable for your account.</p>
    <form on:submit|preventDefault={handleSubmit}>
        <!-- Current Username Field (Read Only) -->
        <div class="form-group">
            <label for="currentUsername">Current Username</label>
            <input type="text" id="currentUsername" value={currentUsername} disabled />
        </div>

        <!-- New Username Field -->
        <div class="form-group">
            <label for="newUsername">New Username</label>
            <input type="text" id="newUsername" bind:value={newUsername} required />
        </div>

        {#if errorMessage}
            <p class="error-message">{errorMessage}</p>
        {/if}

        {#if successMessage}
            <p class="success-message">{successMessage}</p>
        {/if}

        <button type="submit">Submit</button>
    </form>
</div>

<style>
    /* Container Styling */
    .change-username-container {
        background-color: #f7f7f7; /* Matches light-gray background of the form */
        width: 50%; /* Adjust width as needed */
        margin: 50px auto; /* Center align */
        padding: 30px; /* Inner spacing */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Light shadow for elevation */
        font-family: Arial, sans-serif; /* Clean, modern font */
        color: #333; /* Text color */
    }

    /* Title Styling */
    .change-username-container h1 {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    /* Description Styling */
    .change-username-container p {
        font-size: 0.9rem;
        margin-bottom: 25px;
        color: #666; /* Muted gray for less emphasis */
    }

    /* Form Group Styling */
    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
        font-size: 0.9rem;
        color: #444;
    }

    .form-group input {
        width: 100%; /* Full-width input fields */
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ddd; /* Light border */
        border-radius: 5px; /* Rounded input corners */
        box-sizing: border-box;
        background-color: #fff; /* White background for inputs */
    }

    /* Read-Only Input (Current Username) */
    .form-group input[disabled] {
        background-color: #e9ecef; /* Light gray to indicate read-only state */
        color: #6c757d; /* Slightly muted color for read-only input */
    }

    /* Input Focus Styling */
    .form-group input:focus {
        border-color: #007bff; /* Blue border when focused */
        outline: none; /* Remove default outline */
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); /* Subtle glow effect */
    }

    button {
        width: 100%;
        padding: 10px 15px;
        font-size: 1rem;
        background-color: rgba(8, 89, 8, 0.99); /* Blue button background */
        color: white; /* White text */
        border: none; /* Remove border */
        border-radius: 5px; /* Rounded corners */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background-color 0.3s ease; /* Smooth hover transition */
    }

    button:hover {
        background-color: rgba(35, 173, 35, 0.99); /* Darker blue on hover */
    }

    .error-message {
        color: red;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .success-message {
        color: #0c980c;
        font-weight: bold;
        margin-bottom: 10px;
    }
</style>