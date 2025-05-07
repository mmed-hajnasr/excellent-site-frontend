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
	export let allParticipants: any[] = [];

	let enrolledParticipants: any[] = [];
	let nonEnrolledParticipants: any[] = [];
	let isLoading = true;

	async function loadParticipants() {
		try {
			// Load enrolled participants
			const response = await authorizedFetch(`/training_sessions/${session_id}/participants`);
			const data = await response.json();
			const enrolledIds = data.participants.map((p: any) => p.id);
			
			// Split into enrolled/non-enrolled
			enrolledParticipants = allParticipants.filter(p => enrolledIds.includes(p.id));
			nonEnrolledParticipants = allParticipants.filter(p => !enrolledIds.includes(p.id));
		} catch (err) {
			console.error('Error loading participants:', err);
		} finally {
			isLoading = false;
		}
	}

	async function cancelParticipant(participantId: number) {
		try {
			await authorizedFetch(`/training_sessions/${session_id}/participants/${participantId}`, {
				method: 'DELETE'
			});
			// await loadParticipants(); // Refresh the list
			enrolledParticipants = enrolledParticipants.filter(p => p.id !== participantId);
			nonEnrolledParticipants = [
				allParticipants.find(p => p.id === participantId),
				...nonEnrolledParticipants,
			];
		} catch (err) {
			console.error('Error deleting participant:', err);
		}
	}

	async function enrollParticipant(participantId: number) {
		try {
			await authorizedFetch(`/training_sessions/${session_id}/participants/${participantId}`, {
				method: 'POST',
			});
			// await loadParticipants(); // Refresh the list
			nonEnrolledParticipants = nonEnrolledParticipants.filter(p => p.id !== participantId);
			enrolledParticipants = [
				...enrolledParticipants,
				allParticipants.find(p => p.id === participantId),
			];
		} catch (err) {
			console.error('Error adding participant:', err);
		}
	}
</script>

<Modal bind:open size="xl" on:open={loadParticipants}>
	<div class="p-4">
		<h3 class="mb-4 text-xl font-semibold">Manage Participants</h3>

		{#if isLoading}
			<div class="py-4 text-center">Loading participants...</div>
		{:else}
			<Table>
				<TableHead>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>Phone</TableHeadCell>
					<TableHeadCell>Profile</TableHeadCell>
					<TableHeadCell>Structure</TableHeadCell>
					<TableHeadCell>Actions</TableHeadCell>
				</TableHead>
				<TableBody>
					<TableBodyRow>
						<TableBodyCell colspan={6} class="pt-8 pb-2 text-xl font-semibold text-center">
							Enrolled Participants : {enrolledParticipants.length}
						</TableBodyCell>
					</TableBodyRow>
					{#each enrolledParticipants as participant}
						<TableBodyRow>
							<TableBodyCell>{participant.first_name} {participant.last_name}</TableBodyCell>
							<TableBodyCell>{participant.email}</TableBodyCell>
							<TableBodyCell>{participant.phone_number}</TableBodyCell>
							<TableBodyCell>{participant.profile}</TableBodyCell>
							<TableBodyCell>{participant.structure}</TableBodyCell>
							<TableBodyCell>
								<Button color="red" size="sm" on:click={() => cancelParticipant(participant.id)}>
									Remove
								</Button>
							</TableBodyCell>
						</TableBodyRow>
					{/each}

					<TableBodyRow>
						<TableBodyCell colspan={6} class="pt-8 pb-2 text-xl font-semibold text-center">
							Available Participants : {nonEnrolledParticipants.length}
						</TableBodyCell>
					</TableBodyRow>
					{#each nonEnrolledParticipants as participant}
						<TableBodyRow>
							<TableBodyCell>{participant.first_name} {participant.last_name}</TableBodyCell>
							<TableBodyCell>{participant.email}</TableBodyCell>
							<TableBodyCell>{participant.phone_number}</TableBodyCell>
							<TableBodyCell>{participant.profile}</TableBodyCell>
							<TableBodyCell>{participant.structure}</TableBodyCell>
							<TableBodyCell>
								<Button color="green" size="sm" on:click={() => enrollParticipant(participant.id)}>
									Enroll
								</Button>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</Modal>
