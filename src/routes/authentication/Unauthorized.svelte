<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	export let open: boolean = false; // modal control
</script>

<Modal bind:open size="md" class="m-4">
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<p class="text-center text-lg font-semibold text-gray-900 dark:text-white">
			<span class="text-red-500">Unauthorized : </span>
			you are not signed in
		</p>
		<button
			class="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			on:click={() => {
				// Redirect to the sign-in page
				window.location.href = '/authentication/sign-in';
				return (open = false);
			}}
		>
			Sign in
		</button>
		<p class="text-center text-sm font-normal text-gray-500 dark:text-gray-400">
			Please sign in to access this page.
		</p>
	</div>
</Modal>
