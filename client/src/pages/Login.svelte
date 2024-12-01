<script lang="ts">
	import page from "page";
	import {loginSchema} from "../schema/loginSchema";
	import {authToken} from "../stores/auth";
	import {handleAuthResponse} from "../utils/authHandler.svelte";

	let formData = $state({
		email: "",
		password: "",
	})

	let errors: Record<string, string[]> = $state({});
	let isSubmitting = $state(false);

	/**
	 * Handle login form submission
	 * If login was successful redirect to main page
	 * @param e Event
	 */
	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		const result = loginSchema.safeParse(formData);
		if (!result.success) {
			errors = result.error.flatten().fieldErrors;
			return;
		}

		// clear errors
		errors = {};

		// send data to the server
		try {
			isSubmitting = true;

			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/tokens`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(result.data),
			});

			try {
				await handleAuthResponse(response);
				page.redirect("/");
			} catch (err) {
				errors = (err as Error).message ? { message: [(err as Error).message] } : { message: ["An error occurred."] };
				return;
			}
		} catch (err) {
			errors = { message: ["An unexpected error occurred. Please try again."] };
		} finally {
			isSubmitting = false;
		}
	}


</script>

<section>
	<div class="container-base min-h-svh flex flex-col justify-center items-center">
		<div class="w-full max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
			<h1 class="text-xl font-medium mb-6 text-center">Login</h1>
			<form onsubmit={(e: Event) => handleSubmit(e)} class="flex flex-col gap-4">
				<label>
					<span class="text-gray-500 select-none text-xs">Enter your email</span>
					<input
							type="email"
							bind:value={formData.email}
							class="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-500 text-sm"
							placeholder="johndoe@gmail.com"
							required
							autocomplete="email"
					>

					{#if errors.email}
						<p class="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative mt-1.5 text-xs text-center ">
							{errors.email[0]}
						</p>
					{/if}
				</label>
				<label>
					<span class="text-gray-500 select-none text-xs">Password</span>
					<input
							type="password"
							bind:value={formData.password}
							class="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-500 text-sm"
							placeholder="Password"
							required
					>
					{#if errors.password}
						<p class="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative mt-1.5 text-xs text-center ">
							{errors.password[0]}
						</p>
					{/if}

				</label>

				<button type="submit" class=" mt-6 bg-blue-500 text-white rounded-md p-2 disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Login"}
				</button>
			</form>

			{#if errors.message}
				<p class="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative mt-1.5 text-xs text-center ">
					{errors.message}
				</p>
			{/if}
		</div>
	</div>
</section>

<style>
    :global(body) {
        @apply bg-gray-100;
    }
</style>