/**
 * doc controller
 */

import { factories } from '@strapi/strapi'

const uid = 'api::doc.doc' as const

export default factories.createCoreController(uid, ({ strapi }) => ({
	async all(_ctx) {
		try {
			const data = await strapi.entityService.findMany(uid, {
				populate: {
					file: { fields: ['url'] },
				},
				fields: ['id', 'name'],
			})

			return { data }
		} catch (error) {
			return { data: null, error }
		}
	},
}))
