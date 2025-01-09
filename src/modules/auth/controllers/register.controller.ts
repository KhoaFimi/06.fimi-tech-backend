import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { SuccessResponse } from '@/lib/response.js'
import { validationError } from '@/lib/validation-error.js'
import { registerSchema } from '@/modules/auth/schemas/register.schema.js'
import { authService } from '@/modules/auth/services/index.js'

export const registerController = hf.createHandlers(
	describeRoute({
		tags: ['Auth'],
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
		const partnerCode = c.get('partnerCode')

		const res = await authService.register(validatedData, partnerCode)

		return c.json(
			new SuccessResponse({
				statusCode: SuccessCode.CREATED,
				message: 'Đăng ký thành công',
				data: res
			})
		)
	}
)
