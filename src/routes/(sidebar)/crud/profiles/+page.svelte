<script lang="ts">
	import { Button, Heading } from 'flowbite-svelte';
	import { Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
	import { TableHeadCell, Toolbar } from 'flowbite-svelte';
	import { EditOutline, SearchOutline, PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import AddEdit from './AddEdit.svelte';
	import Delete from './Delete.svelte';
	import MetaTag from '../../../utils/MetaTag.svelte';
	import { onMount } from 'svelte';
	import { authorizedFetch } from '../../../utils/api';

	let Profiles: any[] = [];

	onMount(async () => {
		try {
			const res = await authorizedFetch('/profiles');
			const body = await res.json();
			Profiles = body.profiles;
		} catch (err) {
			console.error(err);
		}
	});

	let openAddEdit: boolean = false; // modal control
	let openDelete: boolean = false; // modal control

	let searchQuery: string = '';
	async function search() {
		let request = !searchQuery.trim() ? '/profiles' : '/profiles?search=' + searchQuery.trim();
		try {
			const res = await authorizedFetch(request);

			const body = await res.json();
			Profiles = body.profiles;
		} catch (err) {
			console.error(err);
		}
	}

	let current_profile: any = {};
	const path: string = '/crud/profiles';
	const title: string = 'Excellent training - Profiles';
	const subtitle: string = 'Profiles';
</script>

<MetaTag {path} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
			All Profiles
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Input
					placeholder="Search for profile"
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
					on:click={() => ((current_profile = {}), (openAddEdit = true))}
				>
					<PlusOutline size="sm" />Add profile
				</Button>
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			{#each ['Name', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each Profiles as profile}
				<TableBodyRow class="text-base">
					<TableBodyCell class="p-4">{profile.name}</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_profile = profile), (openAddEdit = true))}
						>
							<EditOutline size="sm" /> Edit profile
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_profile = profile), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete profile
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</main>

<!-- Modals -->

<AddEdit bind:open={openAddEdit} data={current_profile} />
<Delete bind:open={openDelete} profile_id={current_profile.id} />
