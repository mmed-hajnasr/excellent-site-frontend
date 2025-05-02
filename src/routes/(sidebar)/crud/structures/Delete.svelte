<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { authorizedFetch } from '../../../utils/api';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let structure_id: number;

	let isLoading = false;

	async function deleteStructure() {
		isLoading = true;

		try {
			await authorizedFetch(`/structures/${structure_id}`, { method: 'DELETE' });
			dispatch('structureDelete', { id: structure_id });
		} catch (err) {
			console.error('Delete error:', err);
		} finally {
			isLoading = false;
			open = false;
		}
	}
</script>

<Modal bind:open size="sm">
	<ExclamationCircleOutline class="mx-auto mb-4 mt-8 h-10 w-10 text-red-600" />

	<h3 class="mb-6 text-center text-lg text-gray-500 dark:text-gray-400">
		Are you sure you want to delete this structure?
	</h3>

	<div class="flex items-center justify-center">
		<Button on:click={deleteStructure} color="red" class="mr-2" disabled={isLoading}>
			{#if isLoading}
				Deleting...
			{:else}
				Yes, I'm sure
			{/if}
		</Button>
		<Button color="alternative" on:click={() => (open = false)} disabled={isLoading}>
			No, cancel
		</Button>
	</div>
</Modal>
