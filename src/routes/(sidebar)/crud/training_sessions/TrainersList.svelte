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
	let trainers: any[] = [];
	let Employers: any[] = [];
	let isLoading = true;

	async function loadTrainers() {
		try {
			const response = await authorizedFetch(`/training_sessions/${session_id}/trainers`);
			const data = await response.json();
			trainers = data.trainers;

			const employersResponse = await authorizedFetch('/employers');
			const employersBody = await employersResponse.json();
			Employers = employersBody.employers;

			trainers = trainers.map((trainer) => ({
				...trainer,
				employer: Employers.find((employer) => employer.id === trainer.employer_id)?.name
			}));
		} catch (err) {
			console.error('Error loading trainers:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<Modal bind:open size="xl" on:open={loadTrainers}>
	<div class="p-4">
		<h3 class="mb-4 text-xl font-semibold">Assigned Trainers</h3>

		{#if isLoading}
			<div class="py-4 text-center">Loading...</div>
		{:else}
			<Table>
				<TableHead>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>Type</TableHeadCell>
					<TableHeadCell>Employer</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each trainers as trainer}
						<TableBodyRow>
							<TableBodyCell>{trainer.first_name} {trainer.last_name}</TableBodyCell>
							<TableBodyCell>{trainer.email}</TableBodyCell>
							<TableBodyCell>{trainer.type}</TableBodyCell>
							<TableBodyCell>{trainer.employer}</TableBodyCell>
						</TableBodyRow>
					{:else}
						<TableBodyRow>
							<TableBodyCell colspan={4} class="text-center py-4">
								No trainers assigned
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</Modal>

