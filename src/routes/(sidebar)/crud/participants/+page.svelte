<script lang="ts">
	import {
		Avatar,
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Checkbox,
		Heading,
		Indicator
	} from 'flowbite-svelte';
	import { Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
	import { TableHeadCell, Toolbar, ToolbarButton, ToolbarGroup } from 'flowbite-svelte';
	import { CogSolid, DotsVerticalOutline, DownloadSolid } from 'flowbite-svelte-icons';
	import {
		EditOutline,
		SearchOutline,
		ExclamationCircleSolid,
		PlusOutline,
		TrashBinSolid
	} from 'flowbite-svelte-icons';
    // TODO: connection to api;
	import Participants from '../../../data/participants.json';
	import { imagesPath } from '../../../utils/variables';

	import AddEdit from './AddEdit.svelte';
	import Delete from './Delete.svelte';
	import MetaTag from '../../../utils/MetaTag.svelte';

	let openParticipant: boolean = false; // modal control
	let openDelete: boolean = false; // modal control

	let current_user: any = {};
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
				<Input placeholder="Search for participants" class="me-4 w-80 border xl:w-96" />
				<Button
					size="sm"
					class="gap-2 px-3"
					on:click={() => ((current_user = user), (openParticipant = true))}
				>
					<SearchOutline size="sm" /> Search
				</Button>
			</div>

			<div slot="end" class="flex items-center space-x-2">
				<Button
					size="sm"
					class="gap-2 whitespace-nowrap px-3"
					on:click={() => ((current_user = {}), (openParticipant = true))}
				>
					<PlusOutline size="sm" />Add participant
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
			{#each ['Name', 'Phone Number', 'Profile', 'Structure', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each Participants as participant}
				<TableBodyRow class="text-base">
					<TableBodyCell class="w-4 p-4"></TableBodyCell>
					<TableBodyCell class="mr-12 flex items-center space-x-6 whitespace-nowrap p-4">
						<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
							<div class="text-base font-semibold text-gray-900 dark:text-white">
								{participant.first_name}
								{participant.last_name}
							</div>
							<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
								{participant.email}
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
							on:click={() => ((current_user = participant), (openParticipant = true))}
						>
							<EditOutline size="sm" /> Edit Participant
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_user = participant), (openDelete = true))}
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

<AddEdit bind:open={openParticipant} data={current_user} />
<Delete bind:open={openDelete} />
