<script lang="ts">
	import { Avatar, Dropdown, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import { signOut } from '../api';

	export let username: string = '';
</script>

<button class="ms-3 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
	<Avatar size="sm" tabindex={0}>{username.charAt(0)}</Avatar>
</button>
<Dropdown placement="bottom-end">
	<DropdownHeader>
		<span class="block text-sm">{username}</span>
	</DropdownHeader>
	<DropdownItem on:click={signOut}>Sign out</DropdownItem>
</Dropdown>
