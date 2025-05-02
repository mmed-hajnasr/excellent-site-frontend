<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import { handleSubmit } from '../../../utils/api';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};
	let employer: any = {};
	let isNewEmployer: boolean = false;

	function init(form: HTMLFormElement) {
		employer = data.employer;
		isNewEmployer = Object.keys(employer).length === 0;

		for (const key in employer) {
			const el = form.elements.namedItem(key);
			if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
				el.value = employer[key];
			}
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'employers');

		const isNew: boolean = !employer.id;
		const returnedEmployer = isNew ? result.created_employer : result.updated_employer;

		dispatch('employerCreateUpdate', {
			isNew,
			employer: returnedEmployer,
		});
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={!isNewEmployer ? 'Edit Employer' : 'Add new Employer'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<form id="add-edit-employer" use:init on:submit|preventDefault={onSubmit}>
			{#if employer.id}
				<input type="hidden" name="id" value={employer.id} />
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
		<Button type="submit" form="add-edit-employer">{!isNewEmployer ? 'Save all' : 'Add Employer'}</Button>
	</div>
</Modal>
