import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { validationError } from '@/lib/validation-error.js'
import { newVerificationSchema } from '@/modules/publishers/schemas/new-verification.schema.js'
import { publishersService } from '@/modules/publishers/services/index.js'

export const newVerificationController = hf.createHandlers(
	describeRoute({
		tags: ['Publishers'],
		description: 'Verify tài khoản người dùng thông qua OTP',
		security: [
			{
				apiKey: [],
				partnerCode: []
			}
		]
	}),
	validator('json', newVerificationSchema, res => {
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

		const res = await publishersService.newVerification(validatedData)

		return c.json({
			...res,
			message: 'Xác thực người dùng thành công'
		})
	}
)
