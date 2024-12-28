<script lang="ts">
	import { browser } from '$app/environment';
	import { replaceState } from '$app/navigation';
	import type { FbTeamData } from '$lib/firebaseTypes';
	import { teamTabState } from '$lib/globalStates.svelte';

	let { teamId, teamData }: { teamId: string; teamData: FbTeamData } = $props();

	$effect(() => {
		if (browser) {
			const currentTab = teamTabState.tab;
			replaceState(`#${currentTab}`, {});
		}
	});
</script>

<div class="flex w-full justify-center border-b">
	<fieldset class="flex w-full max-w-[85rem] px-8">
		<div class="flex">
			<input
				type="radio"
				name="teamTab"
				id="posts"
				value="posts"
				class="peer hidden"
				checked={teamTabState.tab == 'posts'}
				onclick={() => (teamTabState.tab = 'posts')}
			/>
			<label
				class="border-b border-b-transparent px-4 py-3 peer-checked:border-b-black"
				for="posts"
			>
				Posts
			</label>
		</div>
		<div class="flex">
			<input
				type="radio"
				name="teamTab"
				id="members"
				value="members"
				class="peer hidden"
				checked={teamTabState.tab == 'members'}
				onclick={() => (teamTabState.tab = 'members')}
			/>
			<label
				class="border-b border-b-transparent px-4 py-3 peer-checked:border-b-black"
				for="members"
			>
				Members
			</label>
		</div>
		<div class="flex">
			<input
				type="radio"
				name="teamTab"
				id="settings"
				value="settings"
				class="peer hidden"
				checked={teamTabState.tab == 'settings'}
				onclick={() => (teamTabState.tab = 'settings')}
			/>
			<label
				class="border-b border-b-transparent px-4 py-3 peer-checked:border-b-black"
				for="settings"
			>
				Settings
			</label>
		</div>
	</fieldset>
</div>
