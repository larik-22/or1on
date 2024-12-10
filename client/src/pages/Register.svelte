<script lang="ts">
	import { registerSchema } from "../lib/schema/registerSchema";
	import page from "page";
	import { handleAuthResponse} from "../lib/utils/authHandler.svelte";

	let formData = $state({
		email: "",
		password: "",
		confirmPassword: "",
	})

	let errors: Record<string, string[]> = $state({});
	let isSubmitting = $state(false);

	/**
	 * Handle register form submission.
	 * If registering was successful, redirect to the login page.
	 * @param e - Event
	 */
	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		const result = registerSchema.safeParse(formData);
		if (!result.success) {
			errors = result.error.flatten().fieldErrors;
			return;
		}

		// clear errors
		errors = {};

		// remove confirmPassword from the data object
		const {confirmPassword, ...data} = formData;

		// send data to the server
		try {
			isSubmitting = true;

			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			try {
				await handleAuthResponse(response);
				page.redirect("/");
			} catch (err) {
				errors = { message: [err instanceof Error ? err.message : "An error occurred."] };
				return;
			}

		} catch (err) {
			errors = { message: ["An unexpected error occurred. Please try again."] };
		} finally {
			isSubmitting = false;
		}
	}


</script>

<section class="w-[100%]">
	<div class="container-base min-h-svh flex flex-col justify-center items-center">
		<div class="w-full max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
			<h1 class="text-xl font-medium mb-6 text-center">Register</h1>
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

				<label>
					<span class="text-gray-500 select-none text-xs">Confirm Password</span>
					<input
							type="password"
							bind:value={formData.confirmPassword}
							class="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-500 text-sm"
							placeholder="Confirm Password"
							required
					>

					{#if errors.confirmPassword}
						<p class="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative mt-1.5 text-xs text-center ">
							{errors.confirmPassword}
						</p>
					{/if}

					{#if errors.message}
						<p class="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative mt-1.5 text-xs text-center ">
							{errors.message}
						</p>
					{/if}
				</label>

				<button type="submit" class=" mt-6 bg-blue-500 text-white rounded-md p-2 disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Register"}
				</button>
			</form>
		</div>
	</div>
</section>

<style>
    :global(body) {
        @apply bg-gray-100;
    }
</style>