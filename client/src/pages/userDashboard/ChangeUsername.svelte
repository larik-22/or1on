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

            console.log("Username changed to: ", newUsername);
            successMessage = "Username changed successfully!";
            errorMessage = '';

            currentUsername = newUsername;
            newUsername = '';
        }
    };
</script>


<div class="change-username-container">
    <h1>Change Username</h1>
    <p>Update your username to something recognizable for your account.</p>
    <form on:submit|preventDefault={handleSubmit}>

        <div class="form-group">
            <label for="currentUsername">Current Username</label>
            <input type="text" id="currentUsername" value={currentUsername} disabled />
        </div>

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

    .change-username-container {
        background-color: #f7f7f7;
        width: 50%;
        margin: 50px auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        color: #333;
    }

    .change-username-container h1 {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    /*Description*/
    .change-username-container p {
        font-size: 0.9rem;
        margin-bottom: 25px;
        color: #666;
    }


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
        width: 100%;
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-sizing: border-box;
        background-color: #fff;
    }

    .form-group input[disabled] {
        background-color: #e9ecef;
        color: #6c757d;
    }

    .form-group input:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
    }

    button {
        width: 100%;
        padding: 10px 15px;
        font-size: 1rem;
        background-color: rgba(8, 89, 8, 0.99);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: rgba(35, 173, 35, 0.99);
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