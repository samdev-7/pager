<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		addJoinCodeToUser,
		getPublicUserData,
		getTeamsWithJoinCode,
		joinTeam,
		setUserData
	} from '$lib/firebase.client';
	import { Input } from '$lib/components/ui/input';
	import { fbState } from '$lib/globalStates.svelte';
	import { getAuth, signInAnonymously, type User } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { AuthState, type FbTeamData } from '$lib/firebaseTypes';

	let hasPermAccount = $derived(
		!(fbState.state == AuthState.LOGGED_OUT || fbState.user?.isAnonymous)
	);

	let hasError = $state(false);
	let errorMessage = $state('Unknown error.');
	let isLoading = $state(false);

	let confirmStep = $state(false);
	let previewTeam: FbTeamData | null = $state(null);
	let previewTeamOwnerName: string | null = $state(null);
	let previewTeamId: string | null = $state(null);
	let isLoadingConfirmStep = $state(false);

	let code = $state('');
	let name = $state('');

	$effect(() => {
		code = code.replaceAll(/[^a-zA-Z0-9]/g, '');
		code = code.toUpperCase();
	});

	$effect(() => {
		name = name.replaceAll(/[^a-zA-Z0-9 ]/g, '');
		name = name.trimStart();
	});

	function handleError(e: unknown) {
		hasError = true;
		if (e instanceof Error) {
			errorMessage = e.message;
		} else {
			errorMessage = 'Unknown error.';
		}
		isLoading = false;
	}

	async function onJoin() {
		if (code.length !== 6) {
			hasError = true;
			errorMessage = 'Invalid code.';
			return;
		}

		name = name.trim();
		if (!hasPermAccount && name.length < 2) {
			hasError = true;
			errorMessage = 'Name to short.';
			return;
		}

		isLoading = true;

		let user = fbState.user;
		if (!hasPermAccount) {
			try {
				user = (await signInAnonymously(getAuth())).user;
			} catch (e) {
				handleError(e);
				return;
			}

			try {
				await setUserData(user, { name });
			} catch (e) {
				handleError(e);
				return;
			}
		}

		user = user as User;

		try {
			await addJoinCodeToUser(user, code);
		} catch (e) {
			handleError(e);
			return;
		}

		let teams: Record<string, FbTeamData> = {};
		try {
			teams = await getTeamsWithJoinCode(code);
		} catch (e) {
			handleError(e);
			return;
		}

		if (Object.entries(teams).length === 0) {
			handleError(new Error('Invalid code.'));
			return;
		}

		previewTeam = Object.values(teams)[0];
		previewTeamId = Object.keys(teams)[0];

		if (previewTeam.viewer_uids.includes(user.uid)) {
			handleError(new Error('You are already in this team.'));
			return;
		}

		previewTeamOwnerName = (await getPublicUserData(previewTeam.owner_uid))?.name || null;
		confirmStep = true;

		setTimeout(() => {
			isLoading = false;
		}, 1000);
	}

	async function onConfirm() {
		isLoadingConfirmStep = true;
		try {
			await joinTeam(fbState.user as User, previewTeamId as string);
		} catch (e) {
			handleError(e);
			return;
		}
		goto('/teams/' + previewTeamId);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<Navbar isFixed={true} />
	<div class="flex flex-grow flex-col items-center justify-center space-y-4 p-12">
		<Card.Root class="flex flex-col">
			<Card.Header>
				<Card.Title>Join a team</Card.Title>
				<Card.Description>Enter the join code that was given to you.</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col space-y-6">
				<form class="flex flex-col space-y-3" onsubmit={onJoin}>
					<label for="code" class="text-sm font-medium">Join code:</label>
					<InputOTP.Root
						id="code"
						maxlength={6}
						bind:value={code}
						disabled={isLoading}
						minlength={6}
						onPaste={(text) => {
							if (text.length === 7 && text[3] === '-') {
								code = text.slice(0, 3) + text.slice(4);
								return code;
							} else {
								return text;
							}
						}}
					>
						{#snippet children({ cells })}
							<InputOTP.Group>
								{#each cells.slice(0, 3) as cell}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
							<p class="-mt-1 font-bold">-</p>
							<InputOTP.Group>
								{#each cells.slice(3, 6) as cell}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
					{#if !hasPermAccount}
						<label for="name" class="text-sm font-medium">Name:</label>
						<Input
							type="text"
							id="name"
							bind:value={name}
							required={!hasPermAccount}
							minlength={2}
							maxlength={32}
							disabled={isLoading}
						/>
					{/if}
					<Button type="submit" disabled={isLoading}
						>Join team
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="-mb-0.5 size-5"
						>
							<path
								d="M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z"
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
						<Alert.Title>Failed to join</Alert.Title>
						<Alert.Description>{errorMessage || 'Unknown error.'}</Alert.Description>
					</Alert.Root>
				{/if}
			</Card.Content>
		</Card.Root>
		<a class="text-sm text-slate-800 hover:underline" href="/create">
			Create a new team instead →
		</a>
	</div>

	<AlertDialog.Root bind:open={confirmStep}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Join {previewTeam?.name ?? 'this team'}</AlertDialog.Title>
				<AlertDialog.Description>
					{previewTeam?.name ?? 'This team'} is owned by {previewTeamOwnerName || 'unknown'} and has
					{previewTeam?.viewer_uids.length ?? 'an unknown number of'} member{previewTeam
						?.viewer_uids.length == 1
						? ''
						: 's'}. You may choose to leave this team at any time.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<form onsubmit={onConfirm}>
					<AlertDialog.Cancel type="button" disabled={isLoadingConfirmStep}
						>Cancel</AlertDialog.Cancel
					>
					<AlertDialog.Action type="submit" disabled={isLoadingConfirmStep}
						>Join {previewTeam?.name ?? ''}</AlertDialog.Action
					>
				</form>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<Footer />
</div>
