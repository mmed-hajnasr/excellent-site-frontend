<script lang="ts">
	import { Card, Chart } from 'flowbite-svelte';
	import options from '../graphs/traffic';
	export let dark: boolean = false;
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
	<Chart options={options(dark)}></Chart>
</Card>
