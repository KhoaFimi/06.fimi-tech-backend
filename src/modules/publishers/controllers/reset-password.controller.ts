import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { validationError } from '@/lib/validation-error.js'
import { resetPasswordSchema } from '@/modules/publishers/schemas/reset-password.schema.js'
import { publishersService } from '@/modules/publishers/services/index.js'

export const resetPasswordController = hf.createHandlers(
	describeRoute({
		tags: ['Publishers'],
		description: 'Reset mật khẩu',
		security: [
			{
				apiKey: [],
				partnerCode: []
			}
		]
	}),
	validator('json', resetPasswordSchema, res => {
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

		const res = await publishersService.resetPassword(validatedData)

		return c.json({
			...res,
			message: 'Reset mật khẩu thành công'
		})
	}
)
