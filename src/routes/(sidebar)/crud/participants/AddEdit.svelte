<script lang="ts">
	import { Button, Select, Input, Label, Modal, Textarea } from 'flowbite-svelte';
	export let open: boolean = false; // modal control
	let selected;

	// TODO: get all structures api:
	import Profiles from '../../../data/structures.json';

	let pitems = Profiles.map((profile) => ({
		value: profile.id.toString(), // Convert id to string for consistency with countries format
		name: profile.name
	}));

	// TODO: get all structures api:
	import Structures from '../../../data/structures.json';

	let structure_items = Structures.map((structure) => ({
		value: structure.id.toString(),
		name: structure.name
	}));

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		if (data?.name) [data.first_name, data.last_name] = data.name.split(' ');
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
	title={Object.keys(data).length ? 'Edit user' : 'Add new user'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<form action="#" use:init>
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
						name="phone"
						type="tel"
						class="border outline-none"
						placeholder="e.g. 56 200 029"
					/>
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					Profile
					<Select class="mt-2" items={pitems} bind:value={selected} />
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
