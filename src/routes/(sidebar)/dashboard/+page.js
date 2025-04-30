/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		series: [
			{
				name: 'domain name 1',
				data: [364, 311, 280, 199, 378]
			},
			{
				name: 'domain name 2',
				data: [400, 374, 280, 311, 199]
			}
		]
	};
}
