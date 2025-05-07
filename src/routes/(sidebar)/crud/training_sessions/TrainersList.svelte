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
	export let allTrainers: any[] = [];

	let assignedTrainers: any[] = [];
	let nonAssignedTrainers: any[] = [];
	let isLoading = true;

	async function loadTrainers() {
		try {
			const response = await authorizedFetch(`/training_sessions/${session_id}/trainers`);
			const data = await response.json();
			const assignedIds = data.trainers.map((t: any) => t.id);

			// Split into assigned/non-assigned
			assignedTrainers = allTrainers.filter(t => assignedIds.includes(t.id));
			nonAssignedTrainers = allTrainers.filter(t => !assignedIds.includes(t.id));
		} catch (err) {
			console.error('Error loading trainers:', err);
		} finally {
			isLoading = false;
		}
	}

	async function cancelTrainer(trainerId: number) {
		try {
			await authorizedFetch(`/training_sessions/${session_id}/trainers/${trainerId}`, {
				method: 'DELETE'
			});
			assignedTrainers = assignedTrainers.filter(t => t.id !== trainerId);
			nonAssignedTrainers = [
				allTrainers.find(t => t.id === trainerId),
				...nonAssignedTrainers,
			];
		} catch (err) {
			console.error('Error deleting trainer:', err);
		}
	}

	async function assignTrainer(trainerId: number) {
		try {
			await authorizedFetch(`/training_sessions/${session_id}/trainers/${trainerId}`, {
				method: 'POST',
			});
			assignedTrainers = [
				...assignedTrainers,
				allTrainers.find(t => t.id === trainerId),
			];
			nonAssignedTrainers = nonAssignedTrainers.filter(t => t.id !== trainerId);
		} catch (err) {
			console.error('Error assigning trainer:', err);
		}
	}
</script>

<Modal bind:open size="xl" on:open={loadTrainers}>
	<div class="p-4">
		<h3 class="mb-4 text-xl font-semibold">Manage Trainers</h3>

		{#if isLoading}
			<div class="py-4 text-center">Loading trainers...</div>
		{:else}
			<Table>
				<TableHead>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>Type</TableHeadCell>
					<TableHeadCell>Employer</TableHeadCell>
					<TableHeadCell>Actions</TableHeadCell>
				</TableHead>
				<TableBody>
					<TableBodyRow>
						<TableBodyCell colspan={6} class="pt-8 pb-2 text-xl font-semibold text-center">
							Assigned Trainers : {assignedTrainers.length}
						</TableBodyCell>
					</TableBodyRow>
					{#each assignedTrainers as trainer}
						<TableBodyRow>
							<TableBodyCell>{trainer.first_name} {trainer.last_name}</TableBodyCell>
							<TableBodyCell>{trainer.email}</TableBodyCell>
							<TableBodyCell>{trainer.type}</TableBodyCell>
							<TableBodyCell>{trainer.employer}</TableBodyCell>
							<TableBodyCell>
								<Button color="red" size="sm" on:click={() => cancelTrainer(trainer.id)}>
									Remove
								</Button>
							</TableBodyCell>
						</TableBodyRow>
					{/each}

					<TableBodyRow>
						<TableBodyCell colspan={6} class="pt-8 pb-2 text-xl font-semibold text-center">
							Available Trainers : {nonAssignedTrainers.length}
						</TableBodyCell>
					</TableBodyRow>
					{#each nonAssignedTrainers as trainer}
						<TableBodyRow>
							<TableBodyCell>{trainer.first_name} {trainer.last_name}</TableBodyCell>
							<TableBodyCell>{trainer.email}</TableBodyCell>
							<TableBodyCell>{trainer.phone_number}</TableBodyCell>
							<TableBodyCell>{trainer.employer}</TableBodyCell>
							<TableBodyCell>
								<Button color="green" size="sm" on:click={() => assignTrainer(trainer.id)}>
									Assign
								</Button>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</Modal>
