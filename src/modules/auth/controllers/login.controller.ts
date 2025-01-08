import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { SuccessResponse } from '@/lib/response.js'
import { validationError } from '@/lib/validation-error.js'
import { loginSchema } from '@/modules/auth/schemas/login.schema.js'
import { authService } from '@/modules/auth/services/index.js'

export const loginController = hf.createHandlers(
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
	validator('json', loginSchema, res => {
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

		const res = await authService.login(validatedData)

		if (res.verificationKey) {
			return c.json(
				new SuccessResponse({
					statusCode: SuccessCode.NOT_VERIFIED,
					message: 'Yêu cầu xác thực tài khoản',
					data: res
				})
			)
		}

		return c.json(
			new SuccessResponse({
				statusCode: SuccessCode.OK,
				message: 'Đăng nhập thành công',
				data: res
			})
		)
	}
)
