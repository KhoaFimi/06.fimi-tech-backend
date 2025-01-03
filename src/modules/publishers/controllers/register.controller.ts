import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { validationError } from '@/lib/validation-error.js'
import { registerSchema } from '@/modules/publishers/schemas/register.schema.js'
import { publishersService } from '@/modules/publishers/services/index.js'

export const registerController = hf.createHandlers(
	describeRoute({
		tags: ['Publishers'],
		description: 'Đăng ký publisher',
		security: [
			{
				apiKey: [],
				partnerCode: []
			}
		]
	}),
	validator('json', registerSchema, res => {
		if (res.success === false) {
			throw new HTTPException(400, {
				message: validationError(res.error),
				res: new Response('Bad Request', {
					status: 400,
					headers: {
						statusCode: ErrorCode.VAL_ERROR
					}
				})
			})
		}
	}),
	async c => {
		const validatedData = c.req.valid('json')

		const { data, statusCode } = await publishersService.register(validatedData)

		return c.json({
			statusCode,
			message: 'Đăng ký người dùng thành công',
			data
		})
	}
)
