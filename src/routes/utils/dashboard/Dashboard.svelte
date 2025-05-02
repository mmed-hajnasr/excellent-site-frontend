<script lang="ts">
	import ChartWidget from '../widgets/ChartWidget.svelte';
	import { onMount } from 'svelte';
	import getChartOptions from '../../(sidebar)/dashboard/chart_options';
	import Pie from './Pie.svelte';
	import { authorizedFetch } from '../api';

	let data: any[] = []; // Initialize empty array
	let chartOptions = getChartOptions(false);
	let dark = false;

	onMount(async () => {
		try {
			const dash_data = await authorizedFetch('/dashboard/training_sessions');
			const responseData = await dash_data.json();
			data = Object.entries(responseData).map(([name, values]) => ({ 
				name, 
				data: values as number[] 
			}));
			
			// Update chart options with new data
			chartOptions = {
				...getChartOptions(dark),
				series: data
			};
			
		} catch (err) {
			console.error(err);
			// Fallback to sample data if needed
			data = [
				{ name: 'domain name 1', data: [364, 311, 280, 199, 378] },
				{ name: 'domain name 2', data: [400, 374, 280, 311, 199] }
			];
			chartOptions.series = data;
		}
	});

	function handler(ev: Event) {
		if ('detail' in ev && typeof ev.detail === 'boolean') {
			dark = ev.detail;
			chartOptions = {
				...getChartOptions(dark),
				series: data // Use latest data
			};
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
