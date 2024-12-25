<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fbState } from '$lib/globalStates.svelte';

	let loggedIn = $derived(!!fbState.user);
</script>

<svelte:head>
	<title>Pager: Instantly notify your team</title>
</svelte:head>
<div class="flex min-h-screen flex-col items-center justify-center text-center">
	<Navbar isFixed={true} />
	{#if loggedIn}
		<div class="flex flex-grow flex-col items-center justify-center p-12">
			<h1 class="text-4xl font-bold">Welcome to Pager</h1>
			<p class="mt-4 text-lg">WIP</p>
		</div>
	{:else}
		<div class="flex flex-grow flex-col items-center justify-center space-y-8 p-12">
			<div class="space-y-4">
				<h1 class="text-7xl font-bold">Instantly notify your team.</h1>
				<p class="text-2xl text-slate-800">The no fuss solution to send updates to your team.</p>
			</div>
			<div class="space-x-4">
				<Button href="/join" class="mt-8">I have a join code</Button>
				<Button href="/create" class="mt-8" variant="outline">Add your team to Pager</Button>
			</div>
		</div>
	{/if}
	<Footer />
</div>
