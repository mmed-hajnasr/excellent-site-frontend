<script lang="ts">
	import ChartWidget from '../widgets/ChartWidget.svelte';
	import { onMount } from 'svelte';
	import getChartOptions from '../../(sidebar)/dashboard/chart_options';
	import Pie from './Pie.svelte';
	import { authorizedFetch } from '../api';

	let data = [
		{
			name: 'domain name 1',
			data: [364, 311, 280, 199, 378]
		},
		{
			name: 'domain name 2',
			data: [400, 374, 280, 311, 199]
		}
	];

	onMount(async () => {
		// TODO: remove comments
		// try {
		// 	const dash_data = await authorizedFetch('/dashboard/training_sessions');
		// 	data = await dash_data.json();
		// } catch (err) {
		// 	console.error(err);
		// }
	});

	let chartOptions = getChartOptions(false);
	chartOptions.series = data;

	let dark = false;

	function handler(ev: Event) {
		if ('detail' in ev && typeof ev.detail === 'boolean') {
			chartOptions = getChartOptions(ev.detail);
			chartOptions.series = data;
			dark = !!ev.detail;
		}
	}

	onMount(() => {
		document.addEventListener('dark', handler);
		return () => document.removeEventListener('dark', handler);
	});
</script>

<div class="mt-px space-y-4">
	<div class="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
		<ChartWidget {chartOptions} title="Domain budget by year" subtitle="all sessions" />
		<Pie {dark} />
	</div>
</div>
