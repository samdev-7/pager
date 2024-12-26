import { initFirebaseClient } from '$lib/firebase.client';

export async function init() {
	await initFirebaseClient();
}
