import { describeRoute } from 'hono-openapi'

import { SuccessCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { SuccessResponse } from '@/lib/response.js'
import { accessMiddleware } from '@/middlewares/access.middleware.js'
import { usersService } from '@/modules/users/services/index.js'

export const meController = hf.createHandlers(
	describeRoute({
		tags: ['User'],
		description: 'Lấy thông tin người dùng sau khi đã đăng nhập',
		security: [
			{
				apiKey: [],
				partnerCode: [],
				bearerAuth: []
			}
		]
	}),
	accessMiddleware(),
	async c => {
		const id = c.get('authUserId')

		const res = await usersService.me(id)

		return c.json(
			new SuccessResponse({
				statusCode: SuccessCode.OK,
				message: 'Lấy thông tin thành công',
				data: res
			})
		)
	}
)
