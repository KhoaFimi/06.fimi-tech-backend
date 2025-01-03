import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { validationError } from '@/lib/validation-error.js'
import { loginSchema } from '@/modules/publishers/schemas/login.schema.js'
import { publishersService } from '@/modules/publishers/services/index.js'

export const loginController = hf.createHandlers(
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

		const res = await publishersService.login(validatedData)

		return c.json({
			...res,
			message:
				res.statusCode === SuccessCode.NOT_VERIFIED
					? 'Yêu cầu xác thực tài khoản'
					: 'Đăng nhập thành công'
		})
	}
)
