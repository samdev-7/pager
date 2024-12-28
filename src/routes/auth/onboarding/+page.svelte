<script lang="ts">
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { fbState } from '$lib/globalStates.svelte';
	import type { PageData } from './$types';
	import { Input } from '$lib/components/ui/input';
	import { setUserData } from '$lib/firebase.client';
	import type { User } from 'firebase/auth';
	import { AuthState } from '$lib/firebaseTypes';

	let { data }: { data: PageData } = $props();

	let hasError = $state(false);
	let errorMessage = $state('Unknown error.');
	let isLoading = $state(false);

	let name = $state('');

	$effect(() => {
		if (fbState.state == AuthState.LOGGED_OUT) {
			if (data.next != '/') {
				goto(`/auth?next=${data.next}`);
			} else {
				goto('/auth');
			}
		}
		if (fbState.state == AuthState.LOGGED_IN && fbState.data) {
			goto(data.next);
		}
	});

	$effect(() => {
		name = name.replaceAll(/[^a-zA-Z0-9 ]/g, '');
		name = name.trimStart();
	});

	function onSubmit() {
		name = name.trim();
		if (name.length < 2 || name.length > 32) {
			hasError = true;
			errorMessage = 'Name must be between 2 and 32 characters.';
			return;
		}

		isLoading = true;
		setUserData(fbState.user as User, { name })
			.then(() => {
				fbState.data = { name };
				goto(data.next);
			})
			.catch((e) => {
				hasError = true;
				errorMessage = e.message;
				isLoading = false;
			});
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<Navbar isFixed={true} />
	<div class="flex flex-grow flex-col items-center justify-center space-y-4 p-12">
		<Card.Root class="flex min-w-96 flex-col">
			<Card.Header>
				<Card.Title>One more step</Card.Title>
				<Card.Description>Finish setting up your account.</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col space-y-6">
				<form class="flex flex-col space-y-2" onsubmit={onSubmit}>
					<div class="space-y-1">
						<label for="name" class="text-sm font-medium">Name:</label>
						<Input
							id="name"
							type="text"
							bind:value={name}
							required
							disabled={isLoading}
							minlength={2}
							maxlength={32}
						/>
					</div>
					<Button type="submit" disabled={isLoading}>
						Continue
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="-mb-0.5 size-5"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z"
								clip-rule="evenodd"
							/>
						</svg>
					</Button>
				</form>
				{#if hasError}
					<Alert.Root variant="destructive">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-5"
						>
							<path d="M12 12v4" />
							<path d="M12 20h.01" />
							<path d="M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708" />
						</svg>
						<Alert.Title>Setup failed</Alert.Title>
						<Alert.Description>
							{errorMessage || 'Unknown error.'}
						</Alert.Description>
					</Alert.Root>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
	<Footer />
</div>
