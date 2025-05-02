<script lang="ts">
	import { Button, Heading } from 'flowbite-svelte';
	import { Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
	import { TableHeadCell, Toolbar } from 'flowbite-svelte';
	import { EditOutline, SearchOutline, PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import AddEdit from './AddEdit.svelte';
	import Delete from './Delete.svelte';
	import MetaTag from '../../../utils/MetaTag.svelte';
	import { onMount } from 'svelte';
	import { authorizedFetch, role_name } from '../../../utils/api';

	let dataIsLoaded: boolean = false;

	let Users: any[] = [];
	let Roles: any[] = [];

	async function loadData() {
		const usersResponse = await authorizedFetch('/users');
		const usersBody     = await usersResponse.json();
		Users               = usersBody.users;

		const rolesResponse = await authorizedFetch('/roles');
		const rolesBody     = await rolesResponse.json();
		Roles               = rolesBody.roles;
	}

	function associateRoles() {
		Users = Users.map((user) => ({
			...user,
			// in case the item is not found, we set the value to undefined
			role: Roles.find((role) => role.id === user.role_id)?.name,
		}));
	}

	onMount(async () => {
		try {
			await loadData();
			associateRoles();
			dataIsLoaded = true;
		} catch (err) {
			console.error(err);
		}
	});

	function handleUserCreateUpdate(event: CustomEvent) {
		const { user, isNew } = event.detail;
		if (isNew) {
			// Add the new user to the list
			Users = [user, ...Users];
		} else {
			// Update the existing user in the list
			const index = Users.findIndex((u) => u.id === user.id);
			if (index !== -1) Users[index] = user;
			Users = [...Users];
		}
	}

	function handleUserDelete(event: CustomEvent) {
		const { id } = event.detail;
		// Remove the deleted user from the list
		Users = Users.filter((user) => user.id !== id);
	}

	let searchQuery: string = '';
	async function search() {
		let request = !searchQuery.trim() ? '/users' : '/users?search=' + searchQuery.trim();
		try {
			const res = await authorizedFetch(request);
			const body = await res.json();
			Users = body.users;

			for (let i = 0; i < Users.length; i++) {
				Users[i].role = role_name[Users[i].role_id];
			}
		} catch (err) {
			console.error(err);
		}
	}

	let openUser: boolean = false; // modal control
	let openDelete: boolean = false; // modal control

	let current_user: any = {};
	const path: string = '/crud/users';
	const title: string = 'Excellent training - Users';
	const subtitle: string = 'Users';
</script>

<MetaTag {path} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
			All Users
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Input
					placeholder="Search for user"
					class="me-4 w-80 border xl:w-96"
					bind:value={searchQuery}
				/>
				<Button size="sm" class="gap-2 px-3" on:click={search}>
					<SearchOutline size="sm" /> Search
				</Button>
			</div>

			<div slot="end" class="flex items-center space-x-2">
				<Button
					size="sm"
					class="gap-2 whitespace-nowrap px-3"
					on:click={() => ((current_user = {}), (openUser = true))}
				>
					<PlusOutline size="sm" />Add user
				</Button>
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			{#each ['Name', 'Role', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each Users as user}
				<TableBodyRow class="text-base">
					<TableBodyCell class="p-4">{user.username}</TableBodyCell>
					<TableBodyCell class="p-4">{user.role}</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_user = user), (openUser = true))}
						>
							<EditOutline size="sm" /> Edit user
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_user = user), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete user
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</main>

<!-- Modals -->
{#if dataIsLoaded}
<AddEdit
  bind:open={openUser}
  on:userCreateUpdate={handleUserCreateUpdate}
  data={{ user: current_user, allRoles: Roles }}
/>
{/if}
<Delete
  bind:open={openDelete}
  on:userDelete={handleUserDelete}
  user_id={current_user.id}
/>
