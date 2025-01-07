import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'
import { JwtTokenExpired } from 'hono/utils/jwt/types'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { accessTokenPublicKey } from '@/constraints/jwt.constraint.js'
import { db } from '@/lib/db.js'
import { hf } from '@/lib/factory.js'
import { IAccessTokenPayload } from '@/modules/token/services/access-token.service.js'

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

		try {
			const decodedToken = (await verify(
				token,
				accessTokenPublicKey,
				'RS256'
			)) as IAccessTokenPayload

			if (decodedToken.level < level)
				throw new HTTPException(401, {
					message: 'Unauthoied',
					res: new Response('Unauthorized', {
						headers: {
							statusCode: ErrorCode.UNAUTHORIZED_ERROR
						}
					})
				})

			const existingPublishers = await db.publisher.findUnique({
				where: {
					id: decodedToken.sub
				},
				include: {
					platform: {
						select: {
							code: true,
							id: true
						}
					}
				}
			})

			if (!existingPublishers)
				throw new HTTPException(401, {
					message: 'Unauthoied',
					res: new Response('Unauthorized', {
						headers: {
							statusCode: ErrorCode.UNAUTHORIZED_ERROR
						}
					})
				})

			c.set('authPublisher', existingPublishers)

			await next()
		} catch (error) {
			if (error instanceof JwtTokenExpired) {
				throw new HTTPException(401, {
					message: 'Unauthoied',
					res: new Response('Unauthorized', {
						headers: {
							statusCode: ErrorCode.UNAUTHORIZED_ERROR
						}
					})
				})
			}
		}
	})
}
