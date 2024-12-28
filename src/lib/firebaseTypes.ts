export enum AuthState {
	LOADING,
	LOGGED_IN,
	LOGGED_OUT
}

export enum TeamState {
	LOADING,
	READY,
	NOT_FOUND
}

export type FbUserData = {
	name: string;
};

export type FbPrivateUserData = {
	join_code?: string;
};

export type FbTeamData = {
	name: string;
	join_code?: string;
	owner_uid: string;
	member_uids: string[];
	viewer_uids: string[];
};
