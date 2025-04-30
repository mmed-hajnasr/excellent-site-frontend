<script lang="ts">
	import { Button, Heading } from 'flowbite-svelte';
	import { Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
	import { TableHeadCell, Toolbar } from 'flowbite-svelte';
	import { EditOutline, SearchOutline, PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import AddEdit from './AddEdit.svelte';
	import Delete from './Delete.svelte';
	import MetaTag from '../../../utils/MetaTag.svelte';
	import { authorizedFetch } from '../../../utils/api';

	let dataIsLoaded: boolean = false;

	let Participants: any[] = [];
	let Profiles:     any[] = [];
	let Structures:   any[] = [];

	async function loadData() {
		const participantsResponse = await authorizedFetch('/participants');
		const participantsBody     = await participantsResponse.json();
		Participants               = participantsBody.participants;

		const profilesResponse = await authorizedFetch('/profiles');
		const profilesBody 	   = await profilesResponse.json();
		Profiles               = profilesBody.profiles;

		const structuresResponse = await authorizedFetch('/structures');
		const structuresBody     = await structuresResponse.json();
		Structures               = structuresBody.structures;
	}

	function associateProfilesAndStructures() {
		Participants = Participants.map((participant) => ({
			...participant,
			// in case the item is not found, we set the value to undefined
			profile: Profiles.find(profile => profile.id === participant.profile_id)?.name,
			structure: Structures.find(structure => structure.id === participant.structure_id)?.name,
		}));
	}

	onMount(async () => {
		try {
			await loadData();
			associateProfilesAndStructures();
			dataIsLoaded = true;
		} catch (err) {
			console.error(err);
		}
	});

	function handleParticipantCreateUpdate(event: CustomEvent) {
		const { participant, isNew } = event.detail;
		if (isNew) {
			// Add the new participant to the list
			Participants = [participant, ...Participants];
		} else {
			// Update the existing participant in the list
			const index = Participants.findIndex(p => p.id === participant.id);
			if (index !== -1) Participants[index] = participant;
			Participants = [...Participants];
		}
	}

	function handleParticipantDelete(event: CustomEvent) {
 		const { id } = event.detail;
		// Remove the participant from the list
		Participants = Participants.filter(p => p.id !== id);
	}

	let searchQuery: string = '';
	async function search() {
		let request = !searchQuery.trim()
			? '/participants'
			: '/participants?search=' + searchQuery.trim();
		try {
			const res = await authorizedFetch(request);

			const body = await res.json();
			Participants = body.participants;
		} catch (err) {
			console.error(err);
		}
	}

	let openAddEdit: boolean = false;
	let openDelete: boolean = false;

	let current_participant: any = {};
	const path: string = '/crud/participants';
	const title: string = 'Excellent training - Participants';
	const subtitle: string = 'Participants';
</script>

<MetaTag {path} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
			All Participants
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Input
					placeholder="Search for participants"
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
					on:click={() => ((current_participant = {}), (openAddEdit = true))}
				>
					<PlusOutline size="sm" />Add participant
				</Button>
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			{#each ['Name', 'Phone Number', 'Profile', 'Structure', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each Participants as participant}
				<TableBodyRow class="text-base">
					<TableBodyCell class="mr-12 flex items-center space-x-6 whitespace-nowrap p-4">
						<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
							<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
								<div class="text-base font-semibold text-gray-900 dark:text-white">
									{participant.first_name}
									{participant.last_name}
								</div>
								<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
									{participant.email}
								</div>
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell class="p-4">{participant.phone_number}</TableBodyCell>
					<TableBodyCell class="p-4">{participant.profile}</TableBodyCell>
					<TableBodyCell class="p-4">{participant.structure}</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_participant = participant), (openAddEdit = true))}
						>
							<EditOutline size="sm" /> Edit Participant
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_participant = participant), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete Participant
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
  on:participantUpdated={handleParticipantCreateUpdate}
  data={{ participant: current_participant, allProfiles: Profiles, allStructures: Structures }}
/>
{/if}
<Delete
  bind:open={openDelete}
  participant_id={current_participant.id}
  on:participantDeleted={handleParticipantDelete}
/>
