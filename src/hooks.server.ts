import { initFirebaseServer } from '$lib/firebase.server';
import { getAuth } from 'firebase-admin/auth';

export async function init() {
	initFirebaseServer();
}

export async function handle({ event, resolve }) {
	if (event.request.headers.has('authorization')) {
		const token = event.request.headers.get('authorization')?.split(' ')[1];
		if (token) {
			try {
				const decodedToken = await getAuth().verifyIdToken(token);
				event.locals.user = decodedToken;
			} catch (e) {
				console.log('Received invalid authorization token');
			}
		}
	}
	return await resolve(event);
}
