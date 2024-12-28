export async function load({ url }) {
	const isSignUp = url.searchParams.get('sign_up') === '1';
	const next = url.searchParams.get('next') || '/';
	return {
		isSignUp,
		next
	};
}
