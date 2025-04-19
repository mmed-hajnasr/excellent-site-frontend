<script>
	import UserMenu from '../utils/widgets/UserMenu.svelte';
	import { DarkMode, NavBrand, NavHamburger, Navbar } from 'flowbite-svelte';
	import '../../app.pcss';
	import Users from '../data/users.json';

	export let fluid = true;
	export let drawerHidden = false;
	export let list = false;
</script>

<Navbar {fluid} class="text-black" color="default" let:NavContainer>
	<NavHamburger
		onClick={() => (drawerHidden = !drawerHidden)}
		class="m-0 me-3 md:block lg:hidden"
	/>
	<NavBrand href="/" class={list ? 'w-40' : 'lg:w-60'}>
		<img src="/images/ET_logo.png" class="me-2.5 h-6 sm:h-8" alt="Flowbite Logo" />
	</NavBrand>
	<div class="ms-auto flex items-center text-gray-500 sm:order-2 dark:text-gray-400">
		<DarkMode />
		<!-- TODO: put the username here -->
		<UserMenu first_name="mmed" last_name="ben hadj nasr" />
	</div>
</Navbar>
