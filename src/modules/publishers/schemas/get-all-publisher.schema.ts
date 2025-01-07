import { z } from 'zod'

export const getAllPublisherSchema = z.object({
	page: z.string().default('1'),
	limit: z.string().default('10'),
	type: z
		.union([z.literal('platform-owner'), z.literal('manager')])
		.default('manager')
})

export type GetAllPublisherSchema = z.infer<typeof getAllPublisherSchema>
