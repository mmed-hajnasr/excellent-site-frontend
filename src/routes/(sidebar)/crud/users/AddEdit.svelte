<script lang="ts">
	import { Button, Input, Label, Modal, Select } from 'flowbite-svelte';
	import { handleSubmit } from '../../../utils/api';
	export let open: boolean = false; // modal control

	export let data: Record<string, string> = {};

	let roles = ['Admin', 'Manager', 'User'];
	let roles_items = roles.map((item) => {
		return {
			value: item,
			name: item
		};
	});

	let selected_role: undefined | string;

	function init(form: HTMLFormElement) {
		if (data?.role) {
			selected_role = data.role;
		} else {
			selected_role = undefined;
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

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'users');
		open = false;
		return result;
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
		<form use:init on:submit|preventDefault={onSubmit}>
			<div class="grid grid-cols-6 gap-6">
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Username</span>
					<Input name="username" class="border outline-none" placeholder="e.g. Bonnie" />
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>New Password</span>
					<Input name="password" type="password" class="border outline-none" />
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Role</span>
					<Select
						name="role"
						class="border outline-none"
						items={roles_items}
						bind:value={selected_role}
						required
					/>
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit">{Object.keys(data).length ? 'Save all' : 'Add user'}</Button>
	</div>
</Modal>
