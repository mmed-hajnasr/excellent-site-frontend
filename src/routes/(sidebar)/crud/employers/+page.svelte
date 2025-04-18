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
	import Employers from '../../../data/participants.json';
	import { imagesPath } from '../../../utils/variables';

	import User from './User.svelte';
	import Delete from './Delete.svelte';
	import MetaTag from '../../../utils/MetaTag.svelte';

	let openUser: boolean = false; // modal control
	let openDelete: boolean = false; // modal control

	let current_user: any = {};
	const path: string = '/crud/employer';
	const title: string = 'Excellent training - Employers';
	const subtitle: string = 'Employers';
</script>

<MetaTag {path} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
			All Employers
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Input placeholder="Search for employer" class="me-4 w-80 border xl:w-96" />
				<Button
					size="sm"
					class="gap-2 px-3"
					on:click={() => ((current_user = user), (openUser = true))}
				>
					<SearchOutline size="sm" /> Search
				</Button>
			</div>

			<div slot="end" class="flex items-center space-x-2">
				<Button
					size="sm"
					class="gap-2 whitespace-nowrap px-3"
					on:click={() => ((current_user = {}), (openUser = true))}
				>
					<PlusOutline size="sm" />Add Employer
				</Button>
				<!-- <Button size="sm" color="alternative" class="gap-2 px-3"> -->
				<!-- 	<DownloadSolid size="md" class="-ml-1" />Export -->
				<!-- </Button> -->
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			{#each ['Name', 'Role', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each Employers as employer}
				<TableBodyRow class="text-base">
					<TableBodyCell class="p-4">{employer.profile}</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_user = user), (openUser = true))}
						>
							<EditOutline size="sm" /> Edit employer
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_user = user), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete employer
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</main>

<!-- Modals -->

<User bind:open={openUser} data={current_user} />
<Delete bind:open={openDelete} />
