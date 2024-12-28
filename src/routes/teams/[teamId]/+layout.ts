import { browser } from '$app/environment';
import { getTeam } from '$lib/firebase.client.js';
import { TeamState } from '$lib/firebaseTypes.js';
import { teamState, teamTabState } from '$lib/globalStates.svelte.js';
import { FirebaseError } from 'firebase/app';

export function load({ params }) {
	if (browser) {
		const currentTab = window.location.hash.slice(1);
		if (['posts', 'members', 'settings'].includes(currentTab)) {
			teamTabState.tab = currentTab;
		}

		getTeam(params.teamId)
			.then((team) => {
				teamState.data = team;
				teamState.teamId = params.teamId;
				teamState.state = TeamState.READY;
			})
			.catch((e) => {
				if (e instanceof FirebaseError && e.code === 'permission-denied') {
					teamState.state = TeamState.NOT_FOUND;
					return;
				}
				throw e;
			});
	}
}
