import { FIREBASE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

import { cert, FirebaseAppError, initializeApp, type App } from 'firebase-admin/app';

const serviceAccountKey = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);

export let fbServerApp: App;

export function initFirebaseServer() {
	if (fbServerApp) {
		return;
	}
	try {
		fbServerApp = initializeApp({
			credential: cert(serviceAccountKey)
		});
	} catch (e) {
		if (e instanceof FirebaseAppError && (e as FirebaseAppError).code === 'app/duplicate-app') {
			// Ignore
		} else {
			throw e;
		}
	}
}
