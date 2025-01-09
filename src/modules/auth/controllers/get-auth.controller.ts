import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { SuccessResponse } from '@/lib/response.js'
import { tokenService } from '@/modules/token/services/index.js'

export const getAuthController = hf.createHandlers(
	describeRoute({
		tags: ['Auth'],
		description: 'Kiểm tra người dùng có hợp lệ hay không',
		security: [
			{
				apiKey: [],
				partnerCode: [],
				bearerAuth: []
			}
		]
	}),
	async c => {
		const authHeader = c.req.header('Authorization')

		if (!authHeader)
			throw new HTTPException(401, {
				message: 'Thiếu token',
				res: new Response('Unauthorized', {
					headers: {
						statusCode: ErrorCode.UNAUTHORIZED_ERROR
					}
				})
			})

		const token = authHeader.split(' ')[1]

		await tokenService.refreshToken.verify(token)

		return c.json(
			new SuccessResponse({
				statusCode: SuccessCode.OK,
				message: 'Đã xác thực người dùng'
			})
		)
	}
)
