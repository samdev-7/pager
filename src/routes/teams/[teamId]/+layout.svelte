<script lang="ts">
	import { teamState } from '$lib/globalStates.svelte';
	import { TeamState, type FbTeamData } from '$lib/firebaseTypes';
	import NotFound from '$lib/components/errors/NotFound.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Teambar from '$lib/components/teams/Teambar.svelte';

	let { children } = $props();

	let teamData = $derived(teamState.data as FbTeamData);
	let teamId = $derived(teamState.teamId as string);
</script>

{#if teamState.state == TeamState.READY}
	<div class="flex min-h-screen flex-col items-center justify-center bg-slate-100">
		<Navbar team={teamData.name} {teamId} />
		<div class="flex w-full flex-col items-center bg-white">
			<div class="flex w-full max-w-[85rem] items-center space-x-4 px-12 pb-14 pt-20">
				<h1 class="text-3xl font-semibold">{teamData.name}</h1>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-6"
				>
					<path
						fill-rule="evenodd"
						d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<Teambar {teamId} {teamData} />
		</div>
		<div class="flex w-full max-w-[85rem] grow">
			{@render children()}
		</div>
		<Footer />
	</div>
{/if}

{#if teamState.state == TeamState.NOT_FOUND}
	<NotFound />
{/if}
