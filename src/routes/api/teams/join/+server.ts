import { json } from '@sveltejs/kit';
import { getFirestore } from 'firebase-admin/firestore';

type TeamJoinRequestData = {
	code: string;
};

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ ok: false, message: 'Unauthorized.' }, { status: 401 });
	}

	const rawData = await request.text();
	let jsonData: any;

	try {
		jsonData = JSON.parse(rawData);
	} catch (e) {
		return json({ ok: false, message: 'Invalid data format.' }, { status: 400 });
	}

	if (!jsonData.code) {
		return json({ ok: false, message: 'No join code.' }, { status: 400 });
	}

	const data: TeamJoinRequestData = jsonData;

	if (!/^[0-9A-Z]{6}$/.test(data.code)) {
		return json({ ok: false, message: 'Invalid join code.' }, { status: 400 });
	}

	console.log(data);

	const db = getFirestore();
	const teamsRef = db.collection('teams');

	const queryRef = teamsRef.where('join_code', '==', data.code);
	const querySnapshot = await queryRef.get();
	if (querySnapshot.empty) {
		return json({ ok: false, message: 'Invalid join code.' }, { status: 400 });
	}

	const team = querySnapshot.docs[0].data();
	console.log(team);

	return json({ ok: true });
}
