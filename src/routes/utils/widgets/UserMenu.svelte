<script lang="ts">
	import { Avatar, Dropdown, DropdownHeader, DropdownItem } from 'flowbite-svelte';

	export let first_name: string = '';
	export let last_name: string = '';
</script>

<button class="ms-3 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
	<Avatar size="sm" tabindex={0}>{first_name.charAt(0)+last_name.charAt(0)}</Avatar>
</button>
<Dropdown placement="bottom-end">
	<DropdownHeader>
		<span class="block text-sm">{first_name + ' ' + last_name}</span>
	</DropdownHeader>
	<DropdownItem>Sign out</DropdownItem>
</Dropdown>
