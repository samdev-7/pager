<script lang="ts">
	import { PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
	import { Button } from '$lib/components/ui/button';
	import { Account, Client } from 'appwrite';
	let { isFixed = true, loggedIn = false } = $props();

	const client = new Client()
		.setEndpoint('https://cloud.appwrite.io/v1')
		.setProject(PUBLIC_APPWRITE_PROJECT_ID);

	const account = new Account(client);

	function logout() {
		account.deleteSession('current').then(() => {
			window.location.href = '/';
		});
	}
</script>

<nav
	class="flex items-center border-b bg-slate-50 px-8 py-3 {isFixed
		? 'fixed left-0 right-0 top-0'
		: 'w-full'}"
>
	<div class="flex items-center space-x-2">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="-mb-1 size-7"
		>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
			<path d="M12 7v2" />
			<path d="M12 13h.01" />
		</svg>
		<h1 class="text-2xl font-bold">Pager</h1>
	</div>
	<div class="flex flex-grow items-center justify-end space-x-4">
		{#if loggedIn}
			<Button on:click={logout}>Logout</Button>
		{:else}
			<Button href="/auth" variant="outline">Sign up</Button>
			<Button href="/auth" variant="default">Login</Button>
		{/if}
	</div>
</nav>
