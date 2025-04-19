<script lang="ts">
    
	import ChartWidget from '../widgets/ChartWidget.svelte';
	import { Card, Chart } from 'flowbite-svelte';
	import type { PageData } from '../../(sidebar)/$types';
	import users from '../graphs/users';
	import DarkChart from '../widgets/DarkChart.svelte';
	import { onMount } from 'svelte';
	import getChartOptions from '../../(sidebar)/dashboard/chart_options';
	import Pie from './Pie.svelte';

	export let data: PageData;

	let chartOptions = getChartOptions(false);
	chartOptions.series = data.series;

	let dark = false;

	function handler(ev: Event) {
		if ('detail' in ev && typeof ev.detail === 'boolean') {
			chartOptions = getChartOptions(ev.detail);
			chartOptions.series = data.series;
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
		<ChartWidget {chartOptions} title="$45,385" subtitle="Sales this week" />
		<Pie {dark} />
	</div>
</div>
