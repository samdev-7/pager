import { FIREBASE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

import { cert, FirebaseAppError, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

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

type RawPagerTeam = {
	join_code?: string;
	name: string;
	owner_uids: string[];
	viewer_uids: string[];
};

type RawPagerUser = {
	team_uids: string[];
};

export type PagerTeam = RawPagerTeam & {
	uid: string;
	getOwners: () => Promise<PagerUser[]>;
	getViewers: () => Promise<PagerUser[]>;
};

export type PagerUser = RawPagerUser & {
	uid: string;
	name: string;
	getAuthRecord: () => Promise<UserRecord>;
	getTeams: () => Promise<PagerTeam[]>;
};

export async function getPagerTeamByJoinCode(code: string) {
	const db = getFirestore();
	const teamsRef = db.collection('teams');

	const queryRef = teamsRef.where('join_code', '==', code);
	const querySnapshot = await queryRef.get();
	if (querySnapshot.empty) {
		return null;
	}

	const team = querySnapshot.docs[0].data() as PagerTeam;
	team.uid = querySnapshot.docs[0].id;

	team.getOwners = async () => {
		const owners: PagerUser[] = [];
		for (const ownerUid of team.owner_uids) {
			const user = await getPagerUserByUid(ownerUid);
			if (user) {
				owners.push(user);
			}
		}
		return owners;
	};

	team.getViewers = async () => {
		const viewers: PagerUser[] = [];
		for (const viewerUid of team.viewer_uids) {
			const user = await getPagerUserByUid(viewerUid);
			if (user) {
				viewers.push(user);
			}
		}
		return viewers;
	};

	return team;
}

export async function getPagerUserByUid(uid: string) {
	const db = getFirestore();
	const usersRef = db.collection('users');

	const queryRef = usersRef.doc(uid);
	const querySnapshot = await queryRef.get();
	let user: PagerUser | null = null;
	if (querySnapshot.exists) {
		user = querySnapshot.data() as PagerUser;
		user.uid = querySnapshot.id;
	} else {
		const authRecord = await getAuth().getUser(uid);
		user = {
			uid,
			name: authRecord.displayName || 'Unknown',
			team_uids: []
		} as any as PagerUser;
	}

	if (!user) {
		return null;
	}

	user.getAuthRecord = async () => {
		return getAuth().getUser(uid);
	};

	user.getTeams = async () => {
		const teams: PagerTeam[] = [];
		for (const teamUid of user.team_uids) {
			const team = await getPagerTeamByUid(teamUid);
			if (team) {
				teams.push(team);
			}
		}
		return teams;
	};

	return user;
}

export async function getPagerTeamByUid(uid: string) {
	const db = getFirestore();
	const teamsRef = db.collection('teams');

	const queryRef = teamsRef.doc(uid);
	const querySnapshot = await queryRef.get();
	if (!querySnapshot.exists) {
		return null;
	}

	const team = querySnapshot.data() as PagerTeam;
	team.uid = querySnapshot.id;

	team.getOwners = async () => {
		const owners: PagerUser[] = [];
		for (const ownerUid of team.owner_uids) {
			const user = await getPagerUserByUid(ownerUid);
			if (user) {
				owners.push(user);
			}
		}
		return owners;
	};

	team.getViewers = async () => {
		const viewers: PagerUser[] = [];
		for (const viewerUid of team.viewer_uids) {
			const user = await getPagerUserByUid(viewerUid);
			if (user) {
				viewers.push(user);
			}
		}
		return viewers;
	};

	return team;
}
