<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	import {
		getAuth,
		GithubAuthProvider,
		GoogleAuthProvider,
		isSignInWithEmailLink,
		sendSignInLinkToEmail,
		signInWithEmailLink,
		signInWithPopup,
		type AuthProvider
	} from 'firebase/auth';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import Input from '$lib/components/ui/input/input.svelte';

	import { PUBLIC_SITE_URL } from '$env/static/public';

	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	import { fbState } from '$lib/globalStates.svelte';

	let { data }: { data: PageData } = $props();

	let hasError = $state(false);
	let errorMessage = $state('Unknown error.');

	let email = $state('');
	let emailSent = $state(false);
	let emailCooldown = $state(10);

	let signInProcesessing = $state(false);

	console.log(data);

	$effect(() => {
		if (!!fbState.user) {
			goto(data.next);
		}
	});

	if (browser) {
		const emailParam = new URLSearchParams(window.location.search).get('email');

		if (emailParam && isSignInWithEmailLink(getAuth(), window.location.href)) {
			signInWithEmailLink(getAuth(), emailParam, window.location.href)
				.then((result) => {
					if (result?.user) {
						goto(data.next);
					}
				})
				.catch((error) => {
					hasError = true;
					errorMessage = error.message;
				});
		}
	}

	function startCooldownTimer() {
		if (emailCooldown > 0) {
			emailCooldown -= 1;
			setTimeout(() => {
				startCooldownTimer();
			}, 1000);
		}
	}

	function emailAuth() {
		const actionCodeSettings = {
			url: `${PUBLIC_SITE_URL}auth?email=${encodeURIComponent(email)}`,
			handleCodeInApp: true
		};
		sendSignInLinkToEmail(getAuth(), email, actionCodeSettings)
			.then(() => {
				signInProcesessing = false;
				emailSent = true;
				emailCooldown = 30;
				startCooldownTimer();
			})
			.catch((error) => {
				signInProcesessing = false;
				hasError = true;
				errorMessage = error.message;
			});
		signInProcesessing = true;
	}

	function signInWithProvider(provider: AuthProvider) {
		signInWithPopup(getAuth(), provider).catch((error) => {
			signInProcesessing = false;
			hasError = true;
			errorMessage = error.message;
		});
		signInProcesessing = true;
	}

	function googleAuth() {
		const provider = new GoogleAuthProvider();
		signInWithProvider(provider);
	}

	function githubAuth() {
		const provider = new GithubAuthProvider();
		signInWithProvider(provider);
	}
</script>

<svelte:head>
	<title>{data.isSignUp ? 'Sign up' : 'Log in'} – Pager</title>
	<meta name="description" content={`${data.isSignUp ? 'Sign up' : 'Log in'} to Pager.`} />
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center">
	<Navbar isFixed={true} isSignUp={data.isSignUp} isLogIn={!data.isSignUp} />
	<div class="flex flex-grow flex-col items-center justify-center space-y-4 p-12">
		<Card.Root class="flex min-w-96 flex-col">
			<Card.Header>
				<Card.Title
					>{emailSent
						? 'Check your inbox'
						: `${data.isSignUp ? 'Sign up' : 'Log in'} to Pager`}</Card.Title
				>
				<Card.Description>
					{emailSent
						? `A link to ${data.isSignUp ? 'sign up' : 'log in'} has been sent to you.`
						: `Please choose a provider to ${data.isSignUp ? 'sign up' : 'log in'}.`}
				</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col space-y-6">
				{#if !emailSent}
					<form class="flex flex-col space-y-2" onsubmit={emailAuth}>
						<Input
							name="email"
							type="email"
							placeholder="Email"
							bind:value={email}
							required
							disabled={signInProcesessing}
						/>
						<Button type="submit" disabled={signInProcesessing}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="-mb-0.5 mr-2 size-5"
								><rect width="20" height="16" x="2" y="4" rx="2" /><path
									d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
								/></svg
							>
							Email me a log in link
						</Button>
					</form>
					<div class="flex flex-col space-y-2">
						<Button onclick={googleAuth} variant="outline" disabled={signInProcesessing}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="-mb-0.5 mr-2 size-5"
								viewBox="0 0 16 16"
							>
								<path
									fill="currentColor"
									d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301c1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"
								/>
							</svg>
							Continue with Google
						</Button>
						<Button onclick={githubAuth} variant="outline" disabled={signInProcesessing}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="-mb-0.5 mr-2 size-5"
								viewBox="0 0 64 64"
							>
								<path
									fill="currentColor"
									d="M32 0C14 0 0 14 0 32c0 21 19 30 22 30c2 0 2-1 2-2v-5c-7 2-10-2-11-5c0 0 0-1-2-3c-1-1-5-3-1-3c3 0 5 4 5 4c3 4 7 3 9 2c0-2 2-4 2-4c-8-1-14-4-14-15q0-6 3-9s-2-4 0-9c0 0 5 0 9 4c3-2 13-2 16 0c4-4 9-4 9-4c2 7 0 9 0 9q3 3 3 9c0 11-7 14-14 15c1 1 2 3 2 6v8c0 1 0 2 2 2c3 0 22-9 22-30C64 14 50 0 32 0"
								/>
							</svg>
							Continue with GitHub
						</Button>
					</div>
				{:else}
					<Button onclick={emailAuth} variant="outline" disabled={emailCooldown > 0}
						>Resend Email {emailCooldown > 0 ? `(${emailCooldown}s)` : ''}</Button
					>
				{/if}
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
						<Alert.Title>Authentication Failed</Alert.Title>
						<Alert.Description>
							{errorMessage || 'Unknown error.'}
						</Alert.Description>
					</Alert.Root>
				{/if}
			</Card.Content>
		</Card.Root>
		<a class="text-sm text-slate-800 hover:underline" href="/join">Use a join code instead →</a>
	</div>
	<Footer />
</div>
