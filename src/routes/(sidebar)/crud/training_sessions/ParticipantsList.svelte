<script lang="ts">
	import {
		Button,
		Modal,
		Table,
		TableHead,
		TableBody,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell
	} from 'flowbite-svelte';
	import { authorizedFetch } from '../../../utils/api';

	export let open: boolean = false;
	export let session_id: number;
	let participants: any[] = [];
	let Profiles: any[] = [];
	let Structures: any[] = [];
	let isLoading = true;

	async function loadParticipants() {
		try {
			// load participants.
			const response = await authorizedFetch(`/training_sessions/${session_id}/participants`);
			const data = await response.json();
			participants = data.participants;
			// load profiles
			const profilesResponse = await authorizedFetch('/profiles');
			const profilesBody = await profilesResponse.json();
			Profiles = profilesBody.profiles;
			// load structures
			const structuresResponse = await authorizedFetch('/structures');
			const structuresBody = await structuresResponse.json();
			Structures = structuresBody.structures;
            // set structure and profile name for participants.
			participants = participants.map((participant) => ({
				...participant,
				// in case the item is not found, we set the value to undefined
				profile: Profiles.find((profile) => profile.id === participant.profile_id)?.name,
				structure: Structures.find((structure) => structure.id === participant.structure_id)?.name
			}));
		} catch (err) {
			console.error('Error loading participants:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<Modal bind:open size="xl" on:open={loadParticipants}>
	<div class="p-4">
		<h3 class="mb-4 text-xl font-semibold">Enrolled Participants</h3>

		{#if isLoading}
			<div class="py-4 text-center">Loading...</div>
		{:else}
			<Table>
				<TableHead>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>Phone</TableHeadCell>
					<TableHeadCell>Profile</TableHeadCell>
					<TableHeadCell>Structure</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each participants as participant}
						<TableBodyRow>
							<TableBodyCell>{participant.first_name} {participant.last_name}</TableBodyCell>
							<TableBodyCell>{participant.email}</TableBodyCell>
							<TableBodyCell>{participant.phone_number}</TableBodyCell>
							<TableBodyCell>{participant.profile}</TableBodyCell>
							<TableBodyCell>{participant.structure}</TableBodyCell>
						</TableBodyRow>
					{:else}
						<TableBodyRow>
							<TableBodyCell colspan={5} class="text-center py-4"
								>No participants enrolled</TableBodyCell
							>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</Modal>

