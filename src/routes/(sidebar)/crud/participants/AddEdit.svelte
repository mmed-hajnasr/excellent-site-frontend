<script lang="ts">
	import { Button, Select, Input, Label, Modal } from 'flowbite-svelte';
	export let open: boolean = false; // modal control

	// TODO: get all structures api:
	import Profiles from '../../../data/profile.json';

	let profile_items = Profiles.map((profile) => ({
		value: profile.id,
		name: profile.name
	}));

	// TODO: get all structures api:
	import Structures from '../../../data/structures.json';

	let structure_items = Structures.map((structure) => ({
		value: structure.id,
		name: structure.name
	}));

	export let data: Record<string, string> = {};

	let selected_profile: number | undefined;
	let selected_structure: number | undefined;

	function init(form: HTMLFormElement) {
		if (data?.profile) {
			const matchingProfile = profile_items.find((p) => p.name === data.profile);
			if (matchingProfile) {
				selected_profile = matchingProfile.value;
			}
		} else {
			selected_profile = undefined;
		}

		if (data?.structure) {
			const matchingStructure = structure_items.find((s) => s.name === data.structure);
			if (matchingStructure) {
				selected_structure = matchingStructure.value;
			}
		} else {
			selected_structure = undefined;
		}
		for (const key in data) {
			// console.log(key, data[key]);
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
	title={Object.keys(data).length ? 'Edit participant' : 'Add new participant'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<!-- TODO: add post logic -->
		<form action="#" use:init>
			<!-- add the id of the participant to be edited -->
			{#if data?.id}
				<input type="hidden" name="id" value={data.id} />
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
						bind:value={selected_profile}
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					Structure
					<Select
						class="mt-2"
						name="structure_id"
						items={structure_items}
						bind:value={selected_structure}
					/>
				</Label>

				<!-- <Label class="col-span-6 space-y-2 sm:col-span-3"> -->
				<!--                 Structure -->
				<!-- 	<Select class="mt-2" {structure_items} bind:value={selected} /> -->
				<!-- </Label> -->
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit">{Object.keys(data).length ? 'Save all' : 'Add user'}</Button>
	</div>
</Modal>
