/**
 * @implements `Car` controller
 */

import { factories } from '@strapi/strapi'

import { parseQueryParams } from '../../utils'

const uid = 'api::car.car' as const

export default factories.createCoreController(uid, ({ strapi }) => ({
	async random(ctx) {
		try {
			const queryParams = parseQueryParams(ctx.url)
			const excludeId = queryParams.get('id') || 0
			const limit = Number.parseInt(queryParams.get('limit') || '3')

			const ids = (
				await strapi.db.connection
					.select('id')
					.from(strapi.getModel(uid).collectionName)
					.whereNotIn('id', [excludeId])
					.orderByRaw('RANDOM()')
					.limit(limit)
			).map((it) => it.id)

			const data = await strapi.entityService.findMany(uid, {
				populate: {
					carType: {
						fields: ['id', 'name'],
					},
					previewImage: {
						fields: ['url', 'alternativeText'],
					},
				},
				fields: ['name', 'minMinuteRate', 'isWrapped'],
				filters: {
					id: {
						$in: ids,
					},
				},
			})

			return { data }
		} catch (error) {
			return { data: null, error }
		}
	},

	async all(_ctx) {
		try {
			const data = await strapi.entityService.findMany(uid, {
				populate: {
					carType: {
						fields: ['id', 'name'],
					},
					previewImage: {
						fields: ['id', 'url'],
					},
				},
				fields: ['name', 'minMinuteRate', 'isHot', 'isNew', 'isWrapped'],
				sort: [{ carType: { id: 'asc' } }, { publishedAt: 'desc' }],
			})

			return { data }
		} catch (error) {
			return { data: null, error }
		}
	},

	async allIDs(_ctx) {
		try {
			const data = await strapi.entityService.findMany(uid, {
				fields: ['id', 'name', 'isWrapped'],
				sort: [{ carType: { id: 'asc' } }, { publishedAt: 'desc' }],
			})

			return { data }
		} catch (error) {
			return { data: null, error }
		}
	},

	async singleBrief(ctx) {
		try {
			const queryParams = parseQueryParams(ctx.url)
			const id = queryParams.get('id') || 0

			const data = await strapi.entityService.findOne(uid, id, {
				populate: {
					carType: {
						fields: ['id', 'name'],
					},
					previewImage: {
						fields: ['id', 'url'],
					},
				},
				fields: ['name', 'minMinuteRate'],
			})

			return { data }
		} catch (error) {
			return { data: null, error }
		}
	},

	async singleFull(ctx) {
		try {
			const queryParams = parseQueryParams(ctx.url)
			const id = queryParams.get('id') || 0

			const data = await strapi.entityService.findOne(uid, id, {
				populate: {
					previewImage: {
						fields: ['url'],
					},
					sideImages: {
						fields: ['color'],
						populate: { image: { fields: ['url'] }, colorImage: { fields: ['url'] } },
					},
					conditions: {
						fields: ['id', 'name'],
					},
					rates: {
						fields: ['id'],
						populate: {
							rateType: {
								fields: ['name', 'description', 'footer'],
							},
							customRates: {
								fields: ['discount', 'cost'],
								populate: {
									options: {
										fields: ['name', 'price', 'newPrice'],
									},
									conditions: {
										fields: [
											'isResident',
											'experienceMoreThanYear',
											'overTwentyThreeYears',
										],
									},
								},
							},
						},
					},
					characteristics: {
						populate: {
							mainFeatures: {
								fields: ['name', 'description'],
								populate: { icon: { fields: ['url'] } },
							},
							otherFeatures: { fields: ['name'] },
						},
					},
					carType: {
						fields: ['name'],
					},
				},
				fields: ['name', 'minMinuteRate', 'isNew', 'isWrapped', 'isHot'],
			})

			return { data }
		} catch (error) {
			return { data: null, error }
		}
	},
}))
