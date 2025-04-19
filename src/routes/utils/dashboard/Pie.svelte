<script lang="ts">
	import { Card, Chart } from 'flowbite-svelte';
	import options from '../graphs/traffic';
	import SmallPanel from './SmallPanel.svelte';
	import { DesktopPcOutline, MobilePhoneOutline, TabletOutline } from 'flowbite-svelte-icons';
	import More from '../widgets/More.svelte';

	export let dark: boolean = false;
</script>

<Card size="xl" class="h-fit">
	<div
		class="mb-4 items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700 sm:flex"
	>
		<div class="mb-4 w-full sm:mb-0">
			<h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Trainers by structure</h3>
			<span class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl"
				>Trainers</span
			>
		</div>
	</div>
	<Chart options={options(dark)}></Chart>
</Card>
