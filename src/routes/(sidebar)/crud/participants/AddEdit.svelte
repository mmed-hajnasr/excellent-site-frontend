<script lang="ts">
	import { Button, Select, Input, Label, Modal } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { handleSubmit } from '../../../utils/api';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};

	let participant    : any   = {};
	let isNewParticipant: boolean = false;
	let structure_items: any[] = [];
	let profile_items  : any[] = [];

	function init(form: HTMLFormElement) {
		participant = data.participant;
		isNewParticipant = Object.keys(participant).length === 0;
		structure_items = data.allStructures.map((structure: any) => ({
			name: structure.name,
			value: structure.id,
		}));
		profile_items = data.allProfiles.map((profile: any) => ({
			name: profile.name,
			value: profile.id,
		}));

		for (const key in participant) {
			const el = form.elements.namedItem(key);
			if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
				el.value = participant[key];
			}
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'participants');

		// Dispatch an event to notify the parent component
		const isNew: boolean = !participant.id;
		const returnedParticipant = isNew ? result.created_participant : result.updated_participant;

		// associate the profile and structure names
		returnedParticipant.profile = profile_items.find(profile => profile.value === returnedParticipant.profile_id)?.name;
		returnedParticipant.structure = structure_items.find(structure => structure.value === returnedParticipant.structure_id)?.name;

		dispatch('participantCreateUpdate', { 
			isNew,
			participant: returnedParticipant,
		});
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={!isNewParticipant ? 'Edit participant' : 'Add new participant'}
	size="md"
	class="m-4"
>
	<div class="space-y-6 p-0">
		<form id="add-edit-participant" use:init on:submit|preventDefault={onSubmit}>
			{#if participant.id}
				<input type="hidden" name="id" value={participant.id} />
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
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					Profile
					<Select
						class="mt-2"
						name="profile_id"
						items={profile_items}
						bind:value={participant.profile_id}
						required
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					Structure
					<Select
						class="mt-2"
						name="structure_id"
						items={structure_items}
						bind:value={participant.structure_id}
						required
					/>
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit" form="add-edit-participant">{!isNewParticipant ? 'Save all' : 'Add user'}</Button>
	</div>
</Modal>
