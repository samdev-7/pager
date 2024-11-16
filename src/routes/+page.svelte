<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	import { PUBLIC_SITE_URL, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
	import { Client, Account } from 'appwrite';

	const client = new Client()
		.setEndpoint('https://cloud.appwrite.io/v1')
		.setProject(PUBLIC_APPWRITE_PROJECT_ID);

	const account = new Account(client);

	const session = account.getSession('current');
</script>

{#await session then}
	<div class="flex min-h-screen flex-col items-center justify-center text-center">
		<Navbar isFixed={false} loggedIn={true} />
		<div class="flex flex-grow flex-col items-center justify-center p-12">
			<h1 class="text-4xl font-bold">Welcome to Pager</h1>
			<p class="mt-4 text-lg">WIP</p>
		</div>
		<Footer />
	</div>
{:catch error}
	<div class="flex min-h-screen flex-col items-center justify-center text-center">
		<Navbar isFixed={false} />
		<div class="flex flex-grow flex-col items-center justify-center p-12">
			<h1 class="text-4xl font-bold">Welcome to Pager</h1>
			<p class="mt-4 text-lg">
				Please <a href="/auth" class="underline hover:text-slate-600">login</a> to continue.
			</p>
		</div>
		<Footer />
	</div>
{/await}
