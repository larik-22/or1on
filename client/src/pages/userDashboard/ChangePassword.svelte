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
    /* Container Styling */
    .change-password-container {
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
    .change-password-container h1 {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    .error {
        color: red;
    }

    /* Description Styling */
    .change-password-container p {
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

    /* Input Focus Styling */
    .form-group input:focus {
        border-color: #007bff; /* Blue border when focused */
        outline: none; /* Remove default outline */
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); /* Subtle glow effect */
    }

    /* Submit Button Styling */
    button {
        width: 100%; /* Full width */
        padding: 10px 15px;
        font-size: 1rem;
        background-color: #085908; /* Blue button background */
        color: white; /* White text */
        border: none; /* Remove border */
        border-radius: 5px; /* Rounded corners */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background-color 0.3s ease; /* Smooth hover transition */
    }

    /* Button Hover Effect */
    button:hover {
        background-color: rgba(23, 166, 23, 0.99); /* Darker blue on hover */
    }

    /* Error Message Styling */
    .error-message {
        color: red;
        font-weight: bold;
        margin-bottom: 10px;
    }
</style>

