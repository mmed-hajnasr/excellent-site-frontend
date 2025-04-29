import { authorizedFetch } from '../../utils/api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const participants = await authorizedFetch('/participants');
	const body1 = await participants.json();
	return body1;
}
