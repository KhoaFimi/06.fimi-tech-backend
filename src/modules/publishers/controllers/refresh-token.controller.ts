import { describeRoute } from 'hono-openapi'

import { hf } from '@/lib/factory.js'
import { tokenService } from '@/modules/token/services/index.js'

export const refreshTokenController = hf.createHandlers(
	describeRoute({
		tags: ['Publishers'],
		description: 'Lấy access token mới',
		security: [
			{
				apiKey: [],
				partnerCode: [],
				bearerAuth: []
			}
		]
	}),
	async c => {
		const refreshToken = c.req.header('Authorization').split(' ')[1]

		const res = await tokenService.refreshToken.refresh(refreshToken)

		return c.json({
			...res,
			message: 'Lấy access token mới thành công'
		})
	}
)
