import type { User } from 'firebase/auth';

export const fbState: { user: User | null | false } = $state({
	user: false
});
