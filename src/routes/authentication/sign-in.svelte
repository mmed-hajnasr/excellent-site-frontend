<script lang="ts">
	import { Label, Input, Button, Card } from 'flowbite-svelte';
	import MetaTag from '../utils/MetaTag.svelte';
	import { signIn } from '../utils/api';
	let title = 'Sign in to platform';
	let site = {
		name: 'Flowbite',
		img: '/images/flowbite-svelte-icon-logo.svg',
		link: '/',
		imgAlt: 'FlowBite Logo'
	};
	let loginTitle = 'Login to your account';
	let mainClass = 'bg-gray-50 dark:bg-gray-900 w-full';
	let mainDivClass =
		'flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900';
	let siteLinkClass =
		'flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white';
	let siteImgClass = 'mr-4 h-11';
	let cardH1Class = 'text-2xl font-bold text-gray-900 dark:text-white';

	let username = '';
	let password = '';

	const onSubmit = (e: Event) => {
		e.preventDefault(); // Prevent default form submission
		console.log(username, password);
		signIn(username, password);
	};

	const path: string = '/authentication/sign-in';
	const description: string = 'Sign in example - Flowbite Svelte Admin Dashboard';
	const metaTitle: string = 'Flowbite Svelte Admin Dashboard - Sign in';
	const subtitle: string = 'Sign in';
</script>

<MetaTag {path} {description} title={metaTitle} {subtitle} />

<main class={mainClass}>
	<div class={mainDivClass}>
		<a href={site.link} class={siteLinkClass}>
			<img src={site.img} class={siteImgClass} alt={site.imgAlt} />
			<span>{site.name}</span>
		</a>
		<!-- Card -->
		<Card class="w-full" size="md" border={false}>
			<h1 class={cardH1Class}>
				{title}
			</h1>
			<form class="mt-8 space-y-6" on:submit|preventDefault>
				<div>
					<Label for="username" class="mb-2 dark:text-white">Your username</Label>
					<Input
						type="text"
						name="username"
						id="username"
						placeholder="mmed241"
						required
						class="border outline-none dark:border-gray-600 dark:bg-gray-700"
						bind:value={username}
					/>
				</div>
				<div>
					<Label for="password" class="mb-2 dark:text-white">Your password</Label>
					<Input
						type="password"
						name="password"
						id="password"
						placeholder="••••••••"
						required
						class="border outline-none dark:border-gray-600 dark:bg-gray-700"
						bind:value={password}
					/>
				</div>

				<Button type="submit" size="lg" on:click={onSubmit}>{loginTitle}</Button>
			</form>
		</Card>
	</div>
</main>
