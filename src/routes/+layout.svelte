<script lang="ts">
	import { fbState } from '$lib/globalStates.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Pager</title>
</svelte:head>

{#if fbState.user != false}
	{@render children()}
{/if}
