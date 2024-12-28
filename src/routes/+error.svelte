<script>
	import { page } from '$app/state';
	import NotFound from '$lib/components/errors/NotFound.svelte';
</script>

{#if page.status == 404}
	<NotFound />
{:else}
	<h1>Uh oh, something went wrong!</h1>
{/if}
