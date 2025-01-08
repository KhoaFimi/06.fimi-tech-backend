import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'
import { JwtTokenExpired } from 'hono/utils/jwt/types'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { accessTokenPublicKey } from '@/constraints/jwt.constraint.js'
import { db } from '@/lib/db.js'
import { IAccessTokenPayload } from '@/modules/token/types.js'

export const verifyAccessTokenService = async (token: string) => {
	try {
		const decoded = (await verify(
			token,
			accessTokenPublicKey,
			'RS256'
		)) as IAccessTokenPayload

		const existingUser = await db.publisher.findUnique({
			where: {
				id: decoded.sub
			},
			include: {
				platform: {
					select: {
						id: true,
						code: true
					}
				}
			}
		})

		if (!existingUser)
			throw new HTTPException(404, {
				message: 'Access token không chính xác',
				res: new Response('Not Found', {
					headers: {
						statusCode: ErrorCode.WRONG_CREDENTIALS_ERROR
					}
				})
			})

		return {
			user: existingUser,
			level: decoded.level
		}
	} catch (error) {
		if (error instanceof JwtTokenExpired) {
			throw new HTTPException(409, {
				message: 'Access Token hết hạn',
				res: new Response('Unauthorized', {
					headers: {
						statusCode: ErrorCode.ACCESS_TOKEN_EXPIRED_ERROR
					}
				})
			})
		}

		throw error
	}
}
