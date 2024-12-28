<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { AuthState, fbState } from '$lib/globalStates.svelte';
	import { getAuth } from 'firebase/auth';
	let { isFixed = false, isSignUp = false, isLogIn = false } = $props();

	let loggedIn = $derived(fbState.state == AuthState.LOGGED_IN);

	function logOut() {
		getAuth().signOut();
	}
</script>

<nav
	class="flex items-center border-b bg-slate-50 px-8 py-3 {isFixed
		? 'fixed left-0 right-0 top-0'
		: 'sticky left-0 right-0 top-0'}"
>
	<a class="flex items-center space-x-2" href="/">
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
	</a>
	<div class="flex flex-grow items-center justify-end space-x-4">
		{#if loggedIn}
			{#if fbState.data}
				<p>Hi, {fbState.data.name}</p>
			{/if}
			<Button onclick={logOut}>Logout</Button>
		{:else}
			<Button
				href="/auth?sign_up=1"
				variant={isLogIn ? 'default' : 'outline'}
				class={isSignUp ? 'hidden' : ''}>Sign up</Button
			>
			<Button href="/auth" variant="default" class={isLogIn ? 'hidden' : ''}>Log in</Button>
		{/if}
	</div>
</nav>
