<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import { handleSubmit } from '../../../utils/api';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};
	let structure: any = {};
	let isNewStructure: boolean = false;

	function init(form: HTMLFormElement) {
		structure = data.structure;
		isNewStructure = Object.keys(structure).length === 0;

		for (const key in structure) {
			const el = form.elements.namedItem(key);
			if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
				el.value = structure[key];
			}
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'structures');

		const isNew: boolean = !structure.id;
		const returnedStructure = isNew ? result.created_structure : result.updated_structure;

		dispatch('structureCreateUpdate', {
			isNew,
			structure: returnedStructure,
		});
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={!isNewStructure ? 'Edit Structure' : 'Add new Structure'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<form id="add-edit-structure" use:init on:submit|preventDefault={onSubmit}>
			{#if structure.id}
				<input type="hidden" name="id" value={structure.id} />
			{/if}
			<div class="grid grid-cols-6 gap-6">
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>name</span>
					<Input name="name" class="border outline-none" placeholder="e.g. Bonnie" />
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit" form="add-edit-structure">{!isNewStructure ? 'Save all' : 'Add Structure'}</Button>
	</div>
</Modal>
