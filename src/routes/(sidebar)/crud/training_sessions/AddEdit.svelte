<script lang="ts">
	import { Button, Select, Input, Label, Modal, MultiSelect } from 'flowbite-svelte';
	import { handleSubmit } from '../../../utils/api';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};
	let training_session: any = {};
	let isNewSession: boolean = false;
	let domain_items: any[] = [];

	function init(form: HTMLFormElement) {
		training_session = data.training_session;
		isNewSession = Object.keys(training_session).length === 0;
		domain_items = data.allDomains.map((domain: any) => ({
			name: domain.name,
			value: domain.id
		}));

		for (const key in training_session) {
			const el = form.elements.namedItem(key);
			if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
				el.value = training_session[key];
			}
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'training_sessions');

		const isNew: boolean = !training_session.id;
		const returnedTrainingSession = isNew ? result.created_training_session : result.updated_training_session;

		// associate the domain name
		returnedTrainingSession.domain = domain_items.find((domain) => domain.value === returnedTrainingSession.domain_id)?.name;

		dispatch('trainingSessionCreateUpdate', {
			isNew,
			training_session: returnedTrainingSession
		});
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={!isNewSession ? 'Edit training session' : 'Add new training session'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<form id="add-edit-training-session" use:init on:submit|preventDefault={onSubmit}>
			{#if training_session?.id}
				<input type="hidden" name="id" value={training_session.id} />
			{/if}
			<div class="grid grid-cols-6 gap-6">
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Title</span>
					<Input
						name="title"
						class="border outline-none"
						placeholder="e.g. Data science"
						required
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Year</span>
					<Input
						name="year"
						type="number"
						min="1900"
						step="1"
						class="border outline-none"
						placeholder="2023"
						required
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Duration in days</span>
					<Input
						name="duration_days"
						type="number"
						min="0"
						step="1"
						class="border outline-none"
						placeholder="3"
						required
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Budget</span>
					<Input
						name="budget"
						type="number"
						min="0"
						step="0.01"
						class="border outline-none"
						placeholder="150.30"
						required
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-6">
					Domains
					<Select class="mt-2" name="domain" items={domain_items} bind:value={training_session.domain_id} required />
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit" form="add-edit-training-session">{!isNewSession ? 'Save all' : 'Add Training session'}</Button>
	</div>
</Modal>
