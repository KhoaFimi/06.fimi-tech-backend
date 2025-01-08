import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { SuccessResponse } from '@/lib/response.js'
import { tokenService } from '@/modules/token/services/index.js'

export const refreshTokenController = hf.createHandlers(
	describeRoute({
		tags: ['Auth'],
		description: 'Làm mới access token',
		security: [
			{
				apiKey: [],
				partnerCode: [],
				bearerAuth: []
			}
		]
	}),
	async c => {
		const authHeader = await c.req.header('Authorization')

		if (!authHeader || authHeader === '')
			throw new HTTPException(401, {
				message: 'Thiếu refresh token',
				res: new Response('Unauthorized', {
					headers: {
						statusCode: ErrorCode.UNAUTHORIZED_ERROR
					}
				})
			})

		const token = authHeader.split(' ')[1]

		const res = await tokenService.refreshToken.refresh(token)

		return c.json(
			new SuccessResponse({
				statusCode: SuccessCode.OK,
				message: 'Làm mới access token thành công',
				data: res
			})
		)
	}
)
