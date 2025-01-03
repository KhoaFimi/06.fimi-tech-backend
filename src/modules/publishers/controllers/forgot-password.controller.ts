import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { validationError } from '@/lib/validation-error.js'
import { forgotPasswordSchema } from '@/modules/publishers/schemas/forgot-password.schema.js'
import { publishersService } from '@/modules/publishers/services/index.js'

export const forgotPasswordController = hf.createHandlers(
	describeRoute({
		tags: ['Publishers'],
		description: 'Lấy OTP reset mật khẩu',
		security: [
			{
				apiKey: [],
				partnerCode: []
			}
		]
	}),
	validator('json', forgotPasswordSchema, res => {
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

		const res = await publishersService.forgotPassword(validatedData)

		return c.json({
			...res,
			message: 'Lấy OTP reset mật khẩu thành công'
		})
	}
)
