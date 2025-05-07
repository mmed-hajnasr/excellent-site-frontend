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
	import TrainersList from './TrainersList.svelte';
	import ParticipantsList from './ParticipantsList.svelte';

	let dataIsLoaded: boolean = false;

	let TrainingSessions: any[] = [];
	let Domains         : any[] = [];

	let Participants: any[] = [];
	let Profiles    : any[] = [];
	let Structures  : any[] = [];

	let Trainers   : any[] = [];
	let Employers  : any[] = [];

	async function loadData() {
		const trainingSessionsResponse = await authorizedFetch('/training_sessions');
		const domainsResponse 		   = await authorizedFetch('/domains');
		const trainingSessionsBody     = await trainingSessionsResponse.json();
		const domainsBody     		   = await domainsResponse.json();
		TrainingSessions               = trainingSessionsBody.training_sessions;
		Domains               		   = domainsBody.domains;

		const participantsResponse = await authorizedFetch('/participants');
		const profilesResponse 	   = await authorizedFetch('/profiles');
		const structuresResponse   = await authorizedFetch('/structures');
		const participantsBody     = await participantsResponse.json();
		const profilesBody 	   	   = await profilesResponse.json();
		const structuresBody       = await structuresResponse.json();
		Participants               = participantsBody.participants;
		Profiles               	   = profilesBody.profiles;
		Structures                 = structuresBody.structures;

		const trainersResponse  = await authorizedFetch('/trainers');
		const employersResponse = await authorizedFetch('/employers');
		const trainersBody      = await trainersResponse.json();
		const employersBody     = await employersResponse.json();
		Trainers                = trainersBody.trainers;
		Employers               = employersBody.employers;
	}

	function associateDomains() {
		TrainingSessions = TrainingSessions.map((training_session) => ({
			...training_session,
			// in case the item is not found, we set the value to undefined
			domain: Domains.find((domain) => domain.id === training_session.domain_id)?.name,
		}));
	}

	function associateProfilesAndStructures() {
		Participants = Participants.map((participant) => ({
			...participant,
			// in case the item is not found, we set the value to undefined
			profile: Profiles.find(profile => profile.id === participant.profile_id)?.name,
			structure: Structures.find(structure => structure.id === participant.structure_id)?.name,
		}));
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
			associateDomains();
			associateProfilesAndStructures();
			associateEmployers();
			dataIsLoaded = true;
		} catch (err) {
			console.error(err);
		}
	});

	function handleTrainingSessionCreateUpdate(event: CustomEvent) {
		const { training_session, isNew } = event.detail;
		if (isNew) {
			// Add the new training session to the list
			TrainingSessions = [training_session, ...TrainingSessions];
		} else {
			// Update the existing training session in the list
			const index = TrainingSessions.findIndex((t) => t.id === training_session.id);
			if (index !== -1) TrainingSessions[index] = training_session;
			TrainingSessions = [...TrainingSessions];
		}
	}

	function handleTrainingSessionDelete(event: CustomEvent) {
		const { id } = event.detail;
		// Remove the deleted training session from the list
		TrainingSessions = TrainingSessions.filter((training_session) => training_session.id !== id);
	}

	let searchQuery: string = '';
	async function search() {
		let request = !searchQuery.trim()
			? '/training_sessions'
			: '/training_sessions?search=' + searchQuery.trim();
		try {
			const res = await authorizedFetch(request);
			const body = await res.json();
			TrainingSessions = body.training_sessions;
		} catch (err) {
			console.error(err);
		}
	}

	let openAddEdit: boolean = false; // modal control
	let openDelete: boolean = false; // modal control
	let openTrainers: boolean = false;
	let openParticipants: boolean = false;

	let current_session: any = {};
	const path: string = '/crud/training_sessions';
	const title: string = 'Excellent training - Training Sessions';
	const subtitle: string = 'Training Sessions';
</script>

<MetaTag {path} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
			Training Sessions
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Input
					placeholder="Search for Training session"
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
					on:click={() => ((current_session = {}), (openAddEdit = true))}
				>
					<PlusOutline size="sm" />Add training session
				</Button>
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			{#each ['Title', 'Duration', 'Budget', 'Trainers', 'Participants', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each TrainingSessions as training_session}
				<TableBodyRow class="text-base">
					<TableBodyCell class="mr-12 flex w-36 items-center space-x-6 whitespace-nowrap p-4">
						<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
							<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
								<div class="text-base font-semibold text-gray-900 dark:text-white">
									{training_session.title}
								</div>
								<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
									{training_session.domain} - {training_session.year}
								</div>
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell class="p-4">{training_session.duration_days} days</TableBodyCell>
					<TableBodyCell class="p-4">{training_session.budget}$</TableBodyCell>
					<TableBodyCell class="p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => {
								current_session = training_session;
								openTrainers = true;
							}}
						>
							Show trainers
						</Button>
					</TableBodyCell>
					<TableBodyCell class="p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => {
								current_session = training_session;
								openParticipants = true;
							}}
						>
							Show participants
						</Button>
					</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_session = training_session), (openAddEdit = true))}
						>
							<EditOutline size="sm" /> Edit session
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_session = training_session), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete session
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
  on:trainingSessionCreateUpdate={handleTrainingSessionCreateUpdate}
  data={{ training_session: current_session, allDomains: Domains }}
/>
{/if}
<Delete
  bind:open={openDelete}
  on:trainingSessionDelete={handleTrainingSessionDelete}
  session_id={current_session.id}
/>
<TrainersList 
    bind:open={openTrainers}
    session_id={current_session.id}
	allTrainers={Trainers}
/>

<ParticipantsList
    bind:open={openParticipants}
    session_id={current_session.id}
	allParticipants={Participants}
/>
