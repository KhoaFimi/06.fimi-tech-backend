import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { SuccessResponse } from '@/lib/response.js'
import { validationError } from '@/lib/validation-error.js'
import { authService } from '@/modules/auth/services/index.js'

export const logoutController = hf.createHandlers(
	describeRoute({
		tags: ['Auth'],
		description: 'Đăng xuất',
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
			id: z.string().min(1, { message: 'Vui lòng nhập ID' })
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
		const { id } = c.req.valid('param')

		await authService.logout(id)

		return c.json(
			new SuccessResponse({
				statusCode: SuccessCode.OK,
				message: 'Đăng xuất thành công'
			})
		)
	}
)
