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
            //call to backend (for now just log)
            console.log("Password changed successfully!");
            currentPassword = '';
            newPassword = '';
            confirmPassword = '';
            error = '';
        }
    };
</script>

<div class="change-password-container">
    <h1>Change Password</h1>
    <p>Ensure your new password is strong and unique. Make sure to follow the security guidelines.</p>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" bind:value={currentPassword} required/>
        </div>
        <div class="form-group">
            <label for="newPassword">New Password</label>
            <input type="password" id="newPassword" bind:value={newPassword} required/>
        </div>
        <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" bind:value={confirmPassword} required/>
        </div>

        {#if error}
            <p class="error-message">{error}</p>
        {/if}

        <button type="submit">Submit</button>
    </form>
</div>

<style>
    .change-password-container {
        background-color: #f7f7f7;
        width: 50%;
        margin: 50px auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        color: #333;
    }

    .change-password-container h1 {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    .change-password-container p {
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

    .form-group input:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
    }

    /* Submit Button*/
    button {
        width: 100%;
        padding: 10px 15px;
        font-size: 1rem;
        background-color: #085908;
        color: white;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: rgba(23, 166, 23, 0.99);
    }

    .error-message {
        color: red;
        font-weight: bold;
        margin-bottom: 10px;
    }
</style>

