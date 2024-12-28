import type { User } from 'firebase/auth';
import { AuthState, TeamState, type FbTeamData, type FbUserData } from './firebaseTypes';

export let fbState: {
	state: AuthState;
	user?: User | null;
	data?: FbUserData;
} = $state({
	state: AuthState.LOADING
});

export let teamState: {
	state: TeamState;
	teamId?: string;
	data?: FbTeamData;
} = $state({
	state: TeamState.LOADING
});

export let teamTabState = $state({
	tab: 'posts'
});
