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

	let Trainers : any[] = [];
	let Employers: any[] = [];

	async function loadData() {
		const trainersResponse = await authorizedFetch('/trainers');
		const trainersBody     = await trainersResponse.json();
		Trainers               = trainersBody.trainers;

		const employersResponse = await authorizedFetch('/employers');
		const employersBody     = await employersResponse.json();
		Employers               = employersBody.employers;
	}

	function associateEmployers() {
		Trainers = Trainers.map((trainer) => ({
			...trainer,
			// in case the item is not found, we set the value to undefined
			employer: Employers.find((employer) => employer.id === trainer.employer_id)?.name,
		}));
	}

	onMount(async () => {
		try {
			await loadData();
			associateEmployers();
			dataIsLoaded = true;
		} catch (err) {
			console.error(err);
		}
	});

	function handleTrainerCreateUpdate(event: CustomEvent) {
		const { trainer, isNew } = event.detail;
		if (isNew) {
			// Add the new trainer to the list
			Trainers = [trainer, ...Trainers];
		} else {
			// Update the existing trainer in the list
			const index = Trainers.findIndex((t) => t.id === trainer.id);
			if (index !== -1) Trainers[index] = trainer;
			Trainers = [...Trainers];
		}
	}

	function handleTrainerDelete(event: CustomEvent) {
		const { id } = event.detail;
		// Remove the deleted trainer from the list
		Trainers = Trainers.filter((trainer) => trainer.id !== id);
	}

	let searchQuery: string = '';
	async function search() {
		let request = !searchQuery.trim() ? '/trainers' : '/trainers?search=' + searchQuery.trim();
		try {
			const res = await authorizedFetch(request);

			const body = await res.json();
			Trainers = body.trainers;
		} catch (err) {
			console.error(err);
		}
	}

	let openAddEdit: boolean = false; // modal control
	let openDelete: boolean = false; // modal control

	let current_trainer: any = {};
	const path: string = '/crud/trainers';
	const title: string = 'Excellent training - Trainers';
	const subtitle: string = 'Trainers';
</script>

<MetaTag {path} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
			All Trainers
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Input
					placeholder="Search for Trainers"
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
					on:click={() => ((current_trainer = {}), (openAddEdit = true))}
				>
					<PlusOutline size="sm" />Add trainer
				</Button>
				<!-- <Button size="sm" color="alternative" class="gap-2 px-3"> -->
				<!-- 	<DownloadSolid size="md" class="-ml-1" />Export -->
				<!-- </Button> -->
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			<TableHeadCell class="w-4 p-4"></TableHeadCell>
			{#each ['Name', 'Phone Number', 'Type', 'Employer', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each Trainers as trainer}
				<TableBodyRow class="text-base">
					<TableBodyCell class="w-4 p-4"></TableBodyCell>
					<TableBodyCell class="mr-12 flex items-center space-x-6 whitespace-nowrap p-4">
						<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
							<div class="text-base font-semibold text-gray-900 dark:text-white">
								{trainer.first_name}
								{trainer.last_name}
							</div>
							<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
								{trainer.email}
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell class="p-4">{trainer.phone_number}</TableBodyCell>
					<TableBodyCell class="p-4">{trainer.type}</TableBodyCell>
					<TableBodyCell class="p-4">{trainer.employer}</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_trainer = trainer), (openAddEdit = true))}
						>
							<EditOutline size="sm" /> Edit trainer
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_trainer = trainer), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete trainer
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
  on:trainerCreateUpdate={handleTrainerCreateUpdate}
  data={{ trainer: current_trainer, allEmployers: Employers }}
/>
{/if}
<Delete
  bind:open={openDelete}
  on:trainerDelete={handleTrainerDelete}
  trainer_id={current_trainer.id}
/>
