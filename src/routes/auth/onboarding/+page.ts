import type { PageLoad } from './$types';

export async function load({ url }) {
	const next = url.searchParams.get('next') || '/';
	return {
		next
	};
}
