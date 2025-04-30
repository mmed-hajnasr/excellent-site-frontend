<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import { handleSubmit } from '../../../utils/api';
	export let open: boolean = false; // modal control

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		for (const key in data) {
			const el = form.elements.namedItem(key);
			if (el) {
				if (el instanceof HTMLInputElement) {
					el.value = data[key];
				} else if (el instanceof HTMLTextAreaElement) {
					el.value = data[key];
				}
			}
		}
	}

	async function onSubmit(event: Event) {
		const result = await handleSubmit(event, 'profiles');
		open = false;
		return result;
	}
</script>

<Modal
	bind:open
	title={Object.keys(data).length ? 'Edit Profile' : 'Add new Profile'}
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-0">
		<form use:init on:submit|preventDefault={onSubmit}>
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
		<Button type="submit">{Object.keys(data).length ? 'Save all' : 'Add Profile'}</Button>
	</div>
</Modal>
