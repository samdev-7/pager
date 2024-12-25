import { browser } from '$app/environment';
import { initFirebase } from '$lib/firebase';

export async function load() {
	if (browser) {
		initFirebase();
	}
}
