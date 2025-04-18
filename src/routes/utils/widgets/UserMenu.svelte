<script lang="ts">
	import { imagesPath } from '../../utils/variables';
	import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';

	export let username: string = ''; // "Neil Sims",
</script>

<button class="ms-3 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
	<Avatar size="sm" tabindex={0}>{username.charAt(0)}</Avatar>
</button>
<Dropdown placement="bottom-end">
	<DropdownHeader>
		<span class="block text-sm">{username}</span>
	</DropdownHeader>
	<DropdownItem>Sign out</DropdownItem>
</Dropdown>

<!--
@component
[Go to docs](https://flowbite-svelte-admin-dashboard.vercel.app/)
## Props
@prop export let id: number = 0;
@prop export let name: string = '';
@prop export let avatar: string = '';
@prop export let email: string = '';
@prop export let biography: string = '';
@prop export let position: string = '';
@prop export let country: string = '';
@prop export let status: string = '';
-->
