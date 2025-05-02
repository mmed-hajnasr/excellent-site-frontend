<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import { handleSubmit } from '../../../utils/api';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open: boolean = false; // modal control
	export let data: Record<string, any> = {};
	let profile: any = {};
	let isNewProfile: boolean = false;

	function init(form: HTMLFormElement) {
		profile = data.profile;
		isNewProfile = Object.keys(profile).length === 0;

		for (const key in profile) {
			const el = form.elements.namedItem(key);
			if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
				el.value = profile[key];
			}
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'profiles');

		const isNew: boolean = !profile.id;
		const returnedProfile = isNew ? result.created_profile : result.updated_profile;

		dispatch('profileCreateUpdate', {
			isNew,
			profile: returnedProfile,
		});
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={!isNewProfile ? 'Edit Profile' : 'Add new Profile'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<form id="add-edit-profile" use:init on:submit|preventDefault={onSubmit}>
			{#if profile.id}
				<input type="hidden" name="id" value={profile.id} />
			{/if}
			<div class="grid grid-cols-6 gap-6">
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>name</span>
					<Input name="name" class="border outline-none" placeholder="e.g. Bonnie" />
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div slot="footer">
		<Button type="submit" form="add-edit-profile">{!isNewProfile ? 'Save all' : 'Add Profile'}</Button>
	</div>
</Modal>
