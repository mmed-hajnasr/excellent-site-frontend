<script lang="ts">
	import { Button, Input, Label, Modal, Select } from 'flowbite-svelte';
	import { authorizedFetch, handleSubmit } from '../../../utils/api';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};
	let user: any = {};
	let isNewUser: boolean = false;
	let roles_items: any[] = [];

	function init(form: HTMLFormElement) {
		user = data.user;
		isNewUser = Object.keys(user).length === 0;
		roles_items = data.allRoles.map((role: any) => ({
			name: role.name,
			value: role.id,
		}));

		for (const key in user) {
			const el = form.elements.namedItem(key);
			if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
				el.value = user[key];
			}
		}
	}

	async function handleSubmitUser(event: Event) {
		const payload = Object.fromEntries(new FormData(event.target as HTMLFormElement));
		if (!isNewUser && payload.old_password === '') {
			delete payload.old_password;
			delete payload.password;
		}

		try {
			const endpoint = !isNewUser ? `/users/${user.id}` : '/users';
			const method = !isNewUser ? 'PUT' : 'POST';

			const response = await authorizedFetch(endpoint, {
				method,
				body: JSON.stringify(payload)
			});

			// Handle successful response
			const result = await response.json();
			console.log('Success:', result);
			return result;
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmitUser(event);

		const isNew: boolean = !user.id;
		const returnedUser = isNew ? result.created_user : result.updated_user;
		console.log('returnedUser:', returnedUser);
		
		// attach role name to user
		returnedUser.role = data.allRoles.find((role: any) => role.id === returnedUser.role_id)?.name;
		console.log('returnedUser:', returnedUser);

		dispatch('userCreateUpdate', {
			isNew,
			user: returnedUser,
		});
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={!isNewUser ? 'Edit user' : 'Add new user'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<form id="add-edit-user" use:init on:submit|preventDefault={onSubmit}>
			<div class="grid grid-cols-6 gap-6">
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Username</span>
					<Input name="username" class="border outline-none" placeholder="e.g. Bonnie" required />
				</Label>
				{#if !isNewUser}
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Old Password</span>
					<Input name="old_password" type="password" class="border outline-none" />
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>New Password</span>
					<Input name="password" type="password" class="border outline-none" />
				</Label>
				{:else}
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Password</span>
					<Input name="password" type="password" class="border outline-none" required />
				</Label>
				{/if}
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Role</span>
					<Select
						name="role_id"
						class="border outline-none"
						items={roles_items}
						bind:value={user.role_id}
						required
					/>
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit" form="add-edit-user">{!isNewUser ? 'Save all' : 'Add user'}</Button>
	</div>
</Modal>
