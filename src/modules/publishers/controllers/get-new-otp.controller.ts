import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { validationError } from '@/lib/validation-error.js'
import { publishersService } from '@/modules/publishers/services/index.js'

export const getNewOtpController = hf.createHandlers(
	describeRoute({
		tags: ['Publishers'],
		description:
			'Lấy OTP mới trong trường hợp OTP hiện tại hết hạn hoặc người dùng quên OTP',
		security: [
			{
				apiKey: [],
				partnerCode: []
			}
		]
	}),
	validator(
		'param',
		z.object({
			key: z.string().min(1, { message: 'Verification Key là bắt buộc' })
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
		const { key } = c.req.valid('param')

		const res = await publishersService.getNewOtp(key)

		return c.json({
			message: 'Lấy OTP mới thành công',
			...res
		})
	}
)
