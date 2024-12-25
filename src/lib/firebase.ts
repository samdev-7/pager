import { browser } from '$app/environment';
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import {
	browserLocalPersistence,
	getAuth,
	onAuthStateChanged,
	setPersistence,
	type Auth,
	type User
} from 'firebase/auth';
import { fbState } from './globalStates.svelte';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_MEASUREMENT_ID,
	PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET
} from '$env/static/public';

const fbConfig: FirebaseOptions = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
	measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

export async function initFirebase() {
	if (!browser) throw new Error('Firebase must be initialized in the browser');
	const app = initializeApp(fbConfig);
	const auth = getAuth(app);

	onAuthStateChanged(auth, (user) => {
		fbState.user = user;
	});
}
