<script lang="ts">
	import { onMount } from 'svelte';
	import { authorizedFetch } from '../../utils/api';
	import Dashboard from '../../utils/dashboard/Dashboard.svelte';
	import MetaTag from '../../utils/MetaTag.svelte';
	import Footer from '../Footer.svelte';
	export let data;
	onMount(async () => {
		try {
			const res_participant = await authorizedFetch('/dashboard/participants');
			data = await res_participant.json();
		} catch (err) {
			console.error(err);
		}
	});

	const path: string = '/dashboard';
	const description: string = 'Admin Dashboard example using Flowbite Svelte';
	const title: string = 'Flowbite Svelte Admin Dashboard - Dashboard';
	const subtitle: string = 'Admin Dashboard';
</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="p-4">
	<Dashboard {data} />
</main>
<Footer />
