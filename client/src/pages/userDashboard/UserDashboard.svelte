<script lang="ts">
    import ChangePassword from "./ChangePassword.svelte";
    import ChangeUsername from "./ChangeUsername.svelte";
    import LogOut from "./LogOut.svelte";

</script>

<div class="dashboard-container flex">
    <!-- Sidebar -->
    <div class="sidebar w-1/4 bg-gray-100 p-4">
        <div class="user-info mb-8">
            <img src="/path/to/profile-pic.jpg" alt="Profile Picture" class="rounded-full w-16 h-16 mb-2" />
            <h3 class="text-xl font-semibold">Hello, Username</h3>
        </div>
        <nav class="dashboard-nav">
            <ul class="space-y-4">
                <li><a href="/change-password" class="nav-link text-gray-700 hover:text-black">Change Password</a></li>
                <li><a href="/change-username" class="nav-link text-gray-700 hover:text-black">Change Username</a></li>
                <li><a href="/logout" class="nav-link text-gray-700 hover:text-black">Log Out</a></li>
            </ul>
        </nav>
    </div>
</div>


<style>
    .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px;
    }
    .sidebar {
        border-right: 1px solid #d3d3d3;
    }
    .nav-link {
        padding: 10px;
        border-radius: 5px;
    }
    .nav-link:hover {
        background-color: #e0e0e0;
        font-weight: bold;
    }
</style>