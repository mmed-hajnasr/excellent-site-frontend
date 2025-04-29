<script lang="ts">
	import { Button, Select, Input, Label, Modal, MultiSelect } from 'flowbite-svelte';
	import { authorizedFetch } from '../../../utils/api';
	export let open: boolean = false; // modal control
	export let data: Record<string, string> = {};
	let selected_participants: any[] = [];
	let selected_trainers: any[] = [];

	$: if (open && data?.id) {
		// async () => {
		// 	let res = await authorizedFetch('/training_sessions/${data.id}/participants');
		// 	const body = await res.json();
		// 	selected_participants = (body.participants as { id: number }[]).map((item) => item.id);
		// };
		// async () => {
		// 	let res = await authorizedFetch('/training_sessions/${data.id}/trainers');
		// 	const body = await res.json();
		// 	selected_trainers = (body.trainers as { id: number }[]).map((item) => item.id);
		// };
	}

	// TODO: get all domains api:
	import Domains from '../../../data/domains.json';

	let domain_items = Domains.map((domain) => ({
		value: domain.id,
		name: domain.name
	}));

	// TODO: get all trainers api:
	import AllTrainers from '../../../data/trainers.json';

	let trainer_items = AllTrainers.map((trainer) => ({
		value: trainer.id,
		name: trainer.first_name + ' ' + trainer.last_name
	}));

	// TODO: get all participants api:
	import AllParticipants from '../../../data/participants.json';

	let participants_items = AllParticipants.map((participant) => ({
		value: participant.id,
		name: participant.first_name + ' ' + participant.last_name
	}));

	let selected_domain: number | undefined;

	function init(form: HTMLFormElement) {
		if (data?.domain) {
			const matchingDomain = domain_items.find((s) => s.name === data.domain);
			if (matchingDomain) {
				selected_domain = matchingDomain.value;
			}
		} else {
			selected_domain = undefined;
		}
		for (const key in data) {
			const el = form.elements.namedItem(key);
			if (el) {
				if (el instanceof HTMLInputElement) {
					el.value = data[key];
				} else if (el instanceof HTMLTextAreaElement) {
					el.value = data[key];
				}
			}
		}
	}
</script>

<Modal
	bind:open
	title={Object.keys(data).length ? 'Edit training session' : 'Add new training session'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<!-- TODO: send post logic -->
		<form action="#" use:init>
			<!-- add the id of the element to be edited -->
			{#if data?.id}
				<input type="hidden" name="id" value={data.id} />
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
						name="duration"
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
					<Select class="mt-2" name="domain" items={domain_items} bind:value={selected_domain} />
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-6">
					Trainers
					<MultiSelect
						class="mt-2"
						name="trainers"
						items={trainer_items}
						bind:value={selected_trainers}
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-6">
					Participants
					<MultiSelect
						class="mt-2"
						name="participants"
						items={participants_items}
						bind:value={selected_participants}
					/>
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit">{Object.keys(data).length ? 'Save all' : 'Add Training session'}</Button>
	</div>
</Modal>
