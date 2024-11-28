<script lang="ts">
	import { writable } from 'svelte/store';
	import ChangePassword from './userDashboard/ChangePassword.svelte';
	import ChangeUsername from './userDashboard/ChangeUsername.svelte';
	import LogOut from './userDashboard/LogOut.svelte';

	//track which section of the dashboard is displayed
	let currentSection = writable('welcome');

	const showSection = (sectionName) => {
		currentSection.set(sectionName);
	};
</script>

<div class="dashboard">
	<!-- Sidebar -->
	<aside class="sidebar">
		<div class="user-info">
			<img src="/path/to/profile-pic.jpg" alt="Profile Picture" class="profile-img" />
			<h2>Hello, Username</h2>
		</div>
		<nav>
			<ul>
				<li><button on:click={() => showSection('change-password')} class="sidebar-link">Change Password</button></li>
				<li><button on:click={() => showSection('change-username')} class="sidebar-link">Change Username</button></li>
				<li><button on:click={() => showSection('logout')} class="sidebar-link">Log Out</button></li>
			</ul>
		</nav>
	</aside>

	<main class="main-content">
		{#if $currentSection === 'welcome'}
			<div class="welcome-section">
				<h1>Welcome to Your Dashboard</h1>
				<p>Use the options on the left to update your account information.</p>
			</div>
		{/if}

		{#if $currentSection === 'change-password'}
			<ChangePassword />
		{/if}

		{#if $currentSection === 'change-username'}
			<ChangeUsername />
		{/if}

		{#if $currentSection === 'logout'}
			<LogOut />
		{/if}
	</main>
</div>



<style>
	.dashboard {
		display: flex;
		min-height: 100vh;
		font-family: Arial, sans-serif;
	}

	.sidebar {
		width: 25%;
		background: #f7f7f7;
		padding: 20px;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
	}

	.user-info {
		text-align: center;
		margin-bottom: 30px;
	}

	.profile-img {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin-bottom: 10px;
		border: 2px solid #e2e8f0;
	}

	.sidebar h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
	}

	nav ul {
		list-style: none;
		padding: 0;
	}

	nav ul li {
		margin-bottom: 15px;
	}

	.sidebar-link {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		font-size: 1rem;
		padding: 10px;
		color: #333;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s, color 0.3s;
	}

	.sidebar-link:hover {
		background: #e2e2e2;
		font-weight: bold;
	}

	.main-content {
		width: 75%;
		padding: 40px;
		background: #fff;
	}

	.welcome-section {
		max-width: 500px;
		margin: auto;
		background: #f9f9f9;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.welcome-section h1 {
		font-size: 1.5rem;
		margin-bottom: 20px;
		color: #333;
	}

	.welcome-section p {
		font-size: 0.9rem;
		margin-bottom: 20px;
		color: #666;
	}
</style>