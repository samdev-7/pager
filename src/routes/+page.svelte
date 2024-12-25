<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { fbState } from '$lib/globalStates.svelte';

	let loggedIn = $derived(!!fbState.user);
</script>

{#if loggedIn}
	<div class="flex min-h-screen flex-col items-center justify-center text-center">
		<Navbar isFixed={false} />
		<div class="flex flex-grow flex-col items-center justify-center p-12">
			<h1 class="text-4xl font-bold">Welcome to Pager</h1>
			<p class="mt-4 text-lg">WIP</p>
		</div>
		<Footer />
	</div>
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center text-center">
		<Navbar isFixed={false} />
		<div class="flex flex-grow flex-col items-center justify-center p-12">
			<h1 class="text-4xl font-bold">Welcome to Pager</h1>
			<p class="mt-4 text-lg">
				Please <a href="/auth" class="underline hover:text-slate-600">login</a> to continue.
			</p>
		</div>
		<Footer />
	</div>
{/if}
