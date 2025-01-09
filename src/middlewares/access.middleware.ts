import { HTTPException } from 'hono/http-exception'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { tokenService } from '@/modules/token/services/index.js'

export const accessMiddleware = (level: number = 0) => {
	return hf.createMiddleware(async (c, next) => {
		const authorizationHeader = c.req.header('Authorization')

		if (!authorizationHeader)
			throw new HTTPException(401, {
				message: 'Unauthoied',
				res: new Response('Unauthorized', {
					headers: {
						statusCode: ErrorCode.UNAUTHORIZED_ERROR
					}
				})
			})

		const token = authorizationHeader.split(' ')[1]

		const res = await tokenService.accessToken.verify(token)

		if (res.level < level)
			throw new HTTPException(401, {
				message: 'Unauthoied',
				res: new Response('Unauthorized', {
					headers: {
						statusCode: ErrorCode.UNAUTHORIZED_ERROR
					}
				})
			})

		c.set('authUserId', res.user.id)

		await next()
	})
}
