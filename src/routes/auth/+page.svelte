<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import Footer from '$lib/components/Footer.svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';

	import { PUBLIC_SITE_URL, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
	import { Client, Account, OAuthProvider, ID } from 'appwrite';
	import Input from '$lib/components/ui/input/input.svelte';

	let authFailed = $state($page.url.searchParams.get('success') === 'false');
	let authFailedData = $state($page.url.searchParams.get('error'));
	let authFailedMessage = $state(authFailedData ? JSON.parse(authFailedData).message : null);

	let email = $state('');
	let emailSent = $state(false);
	let emailCooldown = $state(10);
	let emailProcessing = $state(false);

	const client = new Client()
		.setEndpoint('https://cloud.appwrite.io/v1')
		.setProject(PUBLIC_APPWRITE_PROJECT_ID);

	const account = new Account(client);

	onMount(() => {
		const emailUserId = new URLSearchParams(window.location.search).get('userId');
		const emailSecret = new URLSearchParams(window.location.search).get('secret');

		account
			.getSession('current')
			.then((session) => {
				if (session) {
					window.location.href = '/';
				}
			})
			.catch(() => {});

		if (emailUserId && emailSecret) {
			emailProcessing = true;
			account
				.createSession(emailUserId, emailSecret)
				.then(() => {
					window.location.href = '/';
					emailProcessing = false;
				})
				.catch((error) => {
					authFailed = true;
					authFailedMessage = error.message;
					emailProcessing = false;
				});
		}
	});

	function slackAuth() {
		account.createOAuth2Session(
			OAuthProvider.Slack,
			PUBLIC_SITE_URL,
			`${PUBLIC_SITE_URL}auth?success=false`
		);
	}

	function tickCooldown() {
		if (emailCooldown > 0) {
			emailCooldown -= 1;
			setTimeout(() => {
				tickCooldown();
			}, 1000);
		}
	}

	function emailAuth() {
		account.createMagicURLToken(ID.unique(), email, `${PUBLIC_SITE_URL}auth`).then(() => {
			emailSent = true;
			emailCooldown = 30;
			tickCooldown();
		});
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="flex flex-grow flex-col items-center justify-center p-12">
		{#if !emailProcessing}
			<Card.Root>
				<Card.Header>
					<Card.Title>{emailSent ? 'Check your inbox' : 'Login to Pager'}</Card.Title>
					<Card.Description>
						{emailSent
							? 'A link to login has been sent to you.'
							: 'Please choose a provider to login.'}
					</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col space-y-6">
					{#if !emailSent}
						<form class="flex flex-col space-y-2" onsubmit={emailAuth}>
							<Input name="email" type="email" placeholder="Email" bind:value={email} required />
							<Button type="submit">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="-mb-0.5 mr-1 size-5"
									><rect width="20" height="16" x="2" y="4" rx="2" /><path
										d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
									/></svg
								>
								Email me a login link
							</Button>
						</form>
						<div class="flex flex-col space-y-2">
							<Button on:click={slackAuth} variant="outline">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="-mb-0.5 mr-1 size-5"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2zm2-8a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2zm8 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2a2 2 0 0 1 2 2zm-2 8a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2z"
									/>
								</svg>
								Login with Hack Club Slack
							</Button>
						</div>
					{:else}
						<Button on:click={emailAuth} variant="outline" disabled={emailCooldown > 0}
							>Resend Email {emailCooldown > 0 ? `(${emailCooldown}s)` : ''}</Button
						>
					{/if}
					{#if authFailed}
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
								{authFailedMessage || 'Please try again.'}
							</Alert.Description>
						</Alert.Root>
					{/if}
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="flex flex-row items-center space-x-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5 animate-spin"
				>
					<path d="M21 12a9 9 0 1 1-6.219-8.56" />
				</svg>
				<p class="text-lg">Logging you in...</p>
			</div>
		{/if}
	</div>
	<Footer />
</div>
