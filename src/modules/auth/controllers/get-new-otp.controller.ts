import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { SuccessResponse } from '@/lib/response.js'
import { validationError } from '@/lib/validation-error.js'
import { authService } from '@/modules/auth/services/index.js'

export const getNewOTPController = hf.createHandlers(
	describeRoute({
		tags: ['Auth'],
		description: 'Lấy OTP mới',
		security: [
			{
				apiKey: [],
				partnerCode: []
			}
		]
	}),
	validator(
		'query',
		z.object({
			key: z.string().min(1, { message: 'Vui lòng nhập key' })
		}),
		res => {
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
		}
	),
	async c => {
		const { key } = c.req.valid('query')

		const res = await authService.getNewOtp(key)

		return c.json(
			new SuccessResponse({
				statusCode: SuccessCode.OK,
				message: 'Lây Otp mới thành công',
				data: res
			})
		)
	}
)
