import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { SuccessResponse } from '@/lib/response.js'
import { validationError } from '@/lib/validation-error.js'
import { resetPasswordSchema } from '@/modules/auth/schemas/reset-password.schema.js'
import { authService } from '@/modules/auth/services/index.js'

export const resetPasswordController = hf.createHandlers(
	describeRoute({
		tags: ['Auth'],
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

		await authService.resetPassword(validatedData)

		return c.json(
			new SuccessResponse({
				statusCode: SuccessCode.OK,
				message: 'Tạo mật khẩu mới thành công'
			})
		)
	}
)
