export default {
	routes: [
		{
			method: 'GET',
			path: '/home-page',
			handler: 'home-page.custom',
			config: {
				auth: false,
			},
		},
	],
}
