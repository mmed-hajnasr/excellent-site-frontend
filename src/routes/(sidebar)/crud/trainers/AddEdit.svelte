<script lang="ts">
	import { Button, Select, Input, Label, Modal } from 'flowbite-svelte';
	import { handleSubmit } from '../../../utils/api';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};

	let trainer  	   : any   = {};
	let isNewTrainer   : boolean = false;
	let employer_items: any[] = [];
	const type_items: any = ['INTERNAL', 'EXTERNAL'].map((type: string) => ({
		name: type,
		value: type,
	}));

	function init(form: HTMLFormElement) {
		trainer = data.trainer;
		isNewTrainer = Object.keys(trainer).length === 0;
		employer_items = data.allEmployers.map((employer: any) => ({
			name: employer.name,
			value: employer.id,
		}));

		for (const key in trainer) {
			const el = form.elements.namedItem(key);
			if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
				el.value = trainer[key];
			}
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'trainers');
		
		const isNew: boolean = !trainer.id;
		const returnedTrainer = isNew ? result.created_trainer : result.updated_trainer;

		// associate the employer name
		returnedTrainer.employer = employer_items.find(employer => employer.value === returnedTrainer.employer_id)?.name;

		dispatch('trainerCreateUpdate', {
			isNew,
			trainer: returnedTrainer,
		});
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={!isNewTrainer ? 'Edit trainer' : 'Add new trainer'}
	size="md"
	class="m-4"
>
	<div class="space-y-6 p-0">
		<form id="add-edit-trainer" use:init on:submit|preventDefault={onSubmit}>
			{#if trainer?.id}
				<input type="hidden" name="id" value={trainer.id} />
			{/if}
			<div class="grid grid-cols-6 gap-6">
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>First Name</span>
					<Input name="first_name" class="border outline-none" placeholder="e.g. Bonnie" required />
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Last Name</span>
					<Input name="last_name" class="border outline-none" placeholder="e.g. Green" required />
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Email</span>
					<Input
						name="email"
						type="email"
						class="border outline-none"
						placeholder="e.g. bonnie@flowbite.com"
						required
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Phone Number</span>
					<Input
						name="phone_number"
						type="tel"
						class="border outline-none"
						placeholder="e.g. 56 200 029"
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-6">
					Employer
					<Select
						class="mt-2"
						name="employer_id"
						items={employer_items}
						bind:value={trainer.employer_id}
						required
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-6">
					Type
					<Select
						class="mt-2"
						name="type"
						items={type_items}
						required
					/>
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit" form="add-edit-trainer">{!isNewTrainer ? 'Save all' : 'Add Trainer'}</Button>
	</div>
</Modal>
