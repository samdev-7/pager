<script>
	import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';

	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import * as InputOTP from '$lib/components/ui/input-otp';

	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let hasError = $state(true);
	let errorMessage = $state('Unknown error.');
	let isLoading = $state(false);

	let confirmStep = $state(false);

	let code = $state('');
	$effect(() => {
		code = code.toUpperCase();
	});

	function onJoin() {}
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
					<InputOTP.Root
						maxlength={6}
						bind:value={code}
						pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
						required
					>
						{#snippet children({ cells })}
							<InputOTP.Group>
								{#each cells.slice(0, 3) as cell}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
							<p class="-mt-1 font-bold">–</p>
							<InputOTP.Group>
								{#each cells.slice(3, 6) as cell}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
					<Button type="submit" disabled={isLoading}>Join team</Button>
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
			Create a new team instead instead →
		</a>
	</div>
	<Footer />
</div>
