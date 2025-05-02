<script lang="ts">
    import { Button, Modal, Table, TableHead, TableBody, TableHeadCell, TableBodyRow, TableBodyCell } from 'flowbite-svelte';
    import { authorizedFetch } from '../../../utils/api';
    
    export let open: boolean = false;
    export let session_id: number;
    let participants: any[] = [];
    let isLoading = true;

    async function loadParticipants() {
        try {
            const response = await authorizedFetch(`/training_sessions/${session_id}/participants`);
            const data = await response.json();
            participants = data.participants;
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
            <div class="text-center py-4">Loading...</div>
        {:else}
            <Table>
                <TableHead>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Email</TableHeadCell>
                    <TableHeadCell>Phone</TableHeadCell>
                    <TableHeadCell>Profile</TableHeadCell>
                </TableHead>
                <TableBody>
                    {#each participants as participant}
                        <TableBodyRow>
                            <TableBodyCell>{participant.first_name} {participant.last_name}</TableBodyCell>
                            <TableBodyCell>{participant.email}</TableBodyCell>
                            <TableBodyCell>{participant.phone_number}</TableBodyCell>
                            <TableBodyCell>{participant.profile}</TableBodyCell>
                        </TableBodyRow>
                    {:else}
                        <TableBodyRow>
                            <TableBodyCell colspan={4} class="text-center py-4">No participants enrolled</TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        {/if}
    </div>
</Modal>