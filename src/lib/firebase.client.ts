import { browser } from '$app/environment';
import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
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
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore';
import {
	AuthState,
	type FbPrivateUserData,
	type FbTeamData,
	type FbUserData
} from './firebaseTypes';

const fbConfig: FirebaseOptions = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
	measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

export async function initFirebaseClient() {
	if (!browser) throw new Error('Firebase must be initialized in the browser');
	const app = initializeApp(fbConfig);
	const auth = getAuth(app);
	getFirestore(app);

	onAuthStateChanged(auth, async (user) => {
		fbState.user = user;

		if (user) {
			fbState.data = await getUserData(user);
		}

		fbState.state = user ? AuthState.LOGGED_IN : AuthState.LOGGED_OUT;
	});
}

export async function getClientToken() {
	if (!browser) throw new Error('Firebase must be used in the browser');
	return await getAuth().currentUser?.getIdToken();
}

export async function getUserData(user: User) {
	return (await getDoc(doc(getFirestore(), `users/${user.uid}`))).data() as FbUserData | undefined;
}

export async function setUserData(user: User, data: FbUserData) {
	return await setDoc(doc(getFirestore(), `users/${user.uid}`), data);
}

export async function updateUserData(user: User, data: Partial<FbUserData>) {
	return await updateDoc(doc(getFirestore(), `users/${user.uid}`), data);
}

export async function getPrivateUserData(user: User) {
	return (await getDoc(doc(getFirestore(), `users/${user.uid}/private/(default)`))).data() as
		| FbPrivateUserData
		| undefined;
}

export async function addJoinCodeToUser(user: User, code: string) {
	let privateData = await getPrivateUserData(user);

	if (!privateData) {
		return await setDoc(doc(getFirestore(), `users/${user.uid}/private/(default)`), {
			join_code: code
		});
	} else {
		return await updateDoc(doc(getFirestore(), `users/${user.uid}/private/(default)`), {
			join_code: code
		});
	}
}

export async function getTeamsWithJoinCode(
	code: string
): Promise<{ [teamId: string]: FbTeamData }> {
	const result = await getDocs(
		query(collection(getFirestore(), 'teams'), where('join_code', '==', code))
	);
	if (result.empty) return {};

	let r = {};

	result.forEach((doc) => {
		r = { ...r, [doc.id]: doc.data() as FbTeamData };
	});

	return r;
}

export async function joinTeam(user: User, teamid: string) {
	await updateDoc(doc(getFirestore(), `teams/${teamid}`), {
		viewer_uids: arrayUnion(user.uid)
	});
}

export async function getTeam(teamid: string) {
	// if permission is denied, return undefined
	return (await getDoc(doc(getFirestore(), `teams/${teamid}`))).data() as FbTeamData | undefined;
}

export async function getPublicUserData(uid: string) {
	return (await getDoc(doc(getFirestore(), `users/${uid}`))).data() as FbUserData | undefined;
}
