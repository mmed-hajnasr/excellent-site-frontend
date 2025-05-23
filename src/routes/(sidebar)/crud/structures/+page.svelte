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

	let dataIsLoaded: boolean = false;

	let Structures: any[] = [];

	async function loadData() {
		const structuresResponse = await authorizedFetch('/structures');
		const structuresBody     = await structuresResponse.json();
		Structures               = structuresBody.structures;
	}

	onMount(async () => {
		try {
			await loadData();
			dataIsLoaded = true;
		} catch (err) {
			console.error(err);
		}
	});

	function handleStructureCreateUpdate(event: CustomEvent) {
		const { structure, isNew } = event.detail;

		if (isNew) {
			// Add the new structure to the list
			Structures = [structure, ...Structures];
		} else {
			// Update the existing structure in the list
			const index = Structures.findIndex((s) => s.id === structure.id);
			if (index !== -1) Structures[index] = structure;
			Structures = [...Structures];
		}
	}

	function handleStructureDelete(event: CustomEvent) {
		const { id } = event.detail;
		// Remove the deleted structure from the list
		Structures = Structures.filter((structure) => structure.id !== id);
	}

	let openAddEdit: boolean = false; // modal control
	let openDelete: boolean = false; // modal control

	let searchQuery: string = '';
	async function search() {
		let request = !searchQuery.trim() ? '/structures' : '/structures?search=' + searchQuery.trim();
		try {
			const res = await authorizedFetch(request);

			const body = await res.json();
			Structures = body.structures;
		} catch (err) {
			console.error(err);
		}
	}

	let current_structure: any = {};
	const path: string = '/crud/structures';
	const title: string = 'Excellent training - Structures';
	const subtitle: string = 'Structures';
</script>

<MetaTag {path} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
			All Structures
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Input
					placeholder="Search for structure"
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
					on:click={() => ((current_structure = {}), (openAddEdit = true))}
				>
					<PlusOutline size="sm" />Add structure
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
			{#each Structures as structure}
				<TableBodyRow class="text-base">
					<TableBodyCell class="p-4">{structure.name}</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_structure = structure), (openAddEdit = true))}
						>
							<EditOutline size="sm" /> Edit structure
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_structure = structure), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete structure
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
  bind:open={openAddEdit}
  on:structureCreateUpdate={handleStructureCreateUpdate}
  data={{ structure: current_structure }}
/>
{/if}
<Delete
  bind:open={openDelete}
  on:structureDelete={handleStructureDelete}
  structure_id={current_structure.id}
/>
