<script>
    let showConfirmation = false;

    const handleLogout = () => {
        //remove user token, redirect
        console.log("User logged out!");
        //redirect to login screen OR main page that should be adjusted with actual routing once backend is finished
        window.location.href = '/login';
    };

    const toggleConfirmation = () => {
        showConfirmation = !showConfirmation;
    };
</script>

<style>
    .confirmation-dialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
        background-color: #f8f8f8;
        padding: 10px;
        border: 1px solid #ccc;
    }

    .confirmation-dialog button {
        margin-top: 10px;
    }
</style>

<div class="log-out">
    <button on:click={toggleConfirmation}>Log Out</button>

    {#if showConfirmation}
        <div class="confirmation-dialog">
            <p>Are you sure you want to log out?</p>
            <button on:click={handleLogout}>Yes, log out</button>
            <button on:click={toggleConfirmation}>Cancel</button>
        </div>
    {/if}
</div>
