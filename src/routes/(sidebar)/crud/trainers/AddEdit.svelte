<script lang="ts">
	import { Button, Select, Input, Label, Modal } from 'flowbite-svelte';
	export let open: boolean = false; // modal control
	import { authorizedFetch, handleSubmit } from '../../../utils/api';
	import { onMount } from 'svelte';

	let Employers: any[] = [];

	onMount(async () => {
		try {
			const res1 = await authorizedFetch('/employers');
			const body1 = await res1.json();
			Employers = body1.employers;
		} catch (err) {
			console.error(err);
		}
	});

	let employer_items = Employers.map((employer) => ({
		value: employer.id,
		name: employer.name
	}));

	export let data: Record<string, string> = {};

	let selected_employer: number | undefined;

	function init(form: HTMLFormElement) {
		if (data?.Employer) {
			const matchingEmployer = employer_items.find((s) => s.name === data.Employer);
			if (matchingEmployer) {
				selected_employer = matchingEmployer.value;
			}
		} else {
			selected_employer = undefined;
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

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'trainers');
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={Object.keys(data).length ? 'Edit trainer' : 'Add new trainer'}
	size="md"
	class="m-4"
>
	<div class="space-y-6 p-0">
		<form action="#" use:init on:submit|preventDefault={onSubmit}>
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
				<Label class="col-span-6 space-y-2 sm:col-span-6">
					Employer
					<Select
						class="mt-2"
						name="employer_id"
						items={employer_items}
						bind:value={selected_employer}
					/>
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit">{Object.keys(data).length ? 'Save all' : 'Add Trainer'}</Button>
	</div>
</Modal>
