import type { User } from 'firebase/auth';
import { type FbUserData } from './firebase.client';

export enum AuthState {
	LOADING,
	LOGGED_IN,
	LOGGED_OUT
}

export const fbState: {
	state: AuthState;
	user?: User | null;
	data?: FbUserData;
} = $state({
	state: AuthState.LOADING
});
