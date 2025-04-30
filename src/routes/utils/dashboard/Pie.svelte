<script lang="ts">
	import { Card, Chart } from 'flowbite-svelte';
	import options from '../graphs/traffic';
	import { onMount } from 'svelte';
	import { authorizedFetch } from '../api';
	export let dark: boolean = false;
	let data = options(dark);
	data.series = [1, 2, 3];
	data.labels = ['interne', 'Microsoft', 'Apple'];
	onMount(async () => {
		// TODO: remove comments
		// try {
		// 	const pie_data = await authorizedFetch('/dashboard/employers');
		// 	let res = await pie_data.json();
		//           data.series = res.trainers_count;
		//           data.labels = res.names;
		// } catch (err) {
		// 	console.error(err);
		// }
	});
</script>

<Card size="xl" class="h-fit">
	<div
		class="mb-4 items-center justify-between border-b border-gray-200 pb-4 sm:flex dark:border-gray-700"
	>
		<div class="mb-4 w-full sm:mb-0">
			<h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Trainers by employers</h3>
			<span class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
				Trainers
			</span>
		</div>
	</div>
	<Chart options={data}></Chart>
</Card>
