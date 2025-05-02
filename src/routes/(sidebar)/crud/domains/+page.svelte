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
	let Domains: any[] = [];

	async function loadData() {
		const domainsResponse = await authorizedFetch('/domains');
		const domainsBody     = await domainsResponse.json();
		Domains               = domainsBody.domains;
	}

	onMount(async () => {
		try {
			await loadData();
			dataIsLoaded = true;
		} catch (err) {
			console.error(err);
		}
	});

	function handleDomainCreateUpdate(event: CustomEvent) {
		const { domain, isNew } = event.detail;

		if (isNew) {
			// Add the new domain to the list
			Domains = [domain, ...Domains];
		} else {
			// Update the existing domain in the list
			const index = Domains.findIndex((s) => s.id === domain.id);
			if (index !== -1) Domains[index] = domain;
			Domains = [...Domains];
		}
	}

	function handleDomainDelete(event: CustomEvent) {
		const { id } = event.detail;
		// Remove the deleted domain from the list
		Domains = Domains.filter((domain) => domain.id !== id);
	}

	let openAddEdit: boolean = false; // modal control
	let openDelete: boolean = false; // modal control

	let searchQuery: string = '';
	async function search() {
		let request = !searchQuery.trim() ? '/domains' : '/domains?search=' + searchQuery.trim();
		try {
			const res = await authorizedFetch(request);

			const body = await res.json();
			Domains = body.domains;
		} catch (err) {
			console.error(err);
		}
	}

	let current_domain: any = {};
	const path: string = '/crud/domains';
	const title: string = 'Excellent training - domains';
	const subtitle: string = 'Domains';
</script>

<MetaTag {path} {title} {subtitle} />

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
			All Domains
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<div class="flex items-center space-x-2">
				<Input
					placeholder="Search for domain"
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
					on:click={() => ((current_domain = {}), (openAddEdit = true))}
				>
					<PlusOutline size="sm" />Add domain
				</Button>
			</div>
		</Toolbar>
	</div>
	<Table>
		<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
			{#each ['Name', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each Domains as domain}
				<TableBodyRow class="text-base">
					<TableBodyCell class="p-4">{domain.name}</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_domain = domain), (openAddEdit = true))}
						>
							<EditOutline size="sm" /> Edit domain
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_domain = domain), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete domain
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
  on:domainCreateUpdate={handleDomainCreateUpdate}
  data={{ domain: current_domain }}
/>
{/if}
<Delete
  bind:open={openDelete}
  on:domainDelete={handleDomainDelete}
  domain_id={current_domain.id}
/>
