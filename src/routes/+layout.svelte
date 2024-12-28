<script lang="ts">
	import { goto } from '$app/navigation';
	import { AuthState } from '$lib/firebaseTypes';
	import { fbState } from '$lib/globalStates.svelte';
	import '../app.css';
	import '@fontsource-variable/inter';

	let { children } = $props();

	$effect(() => {
		if (fbState.state == AuthState.LOGGED_IN && !fbState.data) {
			if (!['/auth/onboarding', '/auth'].includes(window.location.pathname)) {
				goto('/auth/onboarding');
			}
		}
	});
</script>

<svelte:head>
	<title>Pager</title>
</svelte:head>

{#if fbState.state != AuthState.LOADING}
	{@render children()}
	<!-- {:else}
	<h1>Loading...</h1> -->
{/if}
