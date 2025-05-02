<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import { handleSubmit } from '../../../utils/api';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};
	let domain: any = {};
	let isNewDomain: boolean = false;

	function init(form: HTMLFormElement) {
		domain = data.domain;
		isNewDomain = Object.keys(domain).length === 0;

		for (const key in domain) {
			const el = form.elements.namedItem(key);
			if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
				el.value = domain[key];
			}
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'domains');

		const isNew: boolean = !domain.id;
		const returnedDomain = isNew ? result.created_domain : result.updated_domain;

		dispatch('domainCreateUpdate', {
			isNew,
			domain: returnedDomain,
		});
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={!isNewDomain ? 'Edit Domain' : 'Add new Domain'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<form id="add-edit-domain" use:init on:submit|preventDefault={onSubmit}>
			{#if domain.id}
				<input type="hidden" name="id" value={domain.id} />
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
		<Button type="submit" form="add-edit-domain">{!isNewDomain ? 'Save all' : 'Add Domain'}</Button>
	</div>
</Modal>
