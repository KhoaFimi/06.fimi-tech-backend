import { z } from 'zod'

export const responseTypeSchema = z.object({
	statusCode: z.number(),
	message: z.string()
})
