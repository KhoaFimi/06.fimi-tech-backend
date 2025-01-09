import argon2 from 'argon2'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'
import { JwtTokenExpired } from 'hono/utils/jwt/types'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { refreshTokenPublicKey } from '@/constraints/jwt.constraint.js'
import { db } from '@/lib/db.js'
import { authService } from '@/modules/auth/services/index.js'
import { IRefreshTokenPayload } from '@/modules/token/types.js'

export const verifyRefreshTokenService = async (token: string) => {
	try {
		const decoded = (await verify(
			token,
			refreshTokenPublicKey,
			'RS256'
		)) as IRefreshTokenPayload

		const existingUser = await db.user.findUnique({
			where: {
				id: decoded.sub
			},
			omit: { password: true },
			include: {
				refreshToken: {
					select: {
						expires: true,
						token: true
					}
				}
			}
		})

		if (!existingUser)
			throw new HTTPException(404, {
				message: 'Refresh token không chính xác',
				res: new Response('Not Found', {
					headers: {
						statusCode: ErrorCode.WRONG_CREDENTIALS_ERROR
					}
				})
			})

		const verifyToken = await argon2.verify(
			existingUser.refreshToken.token,
			token
		)

		if (!verifyToken) {
			await authService.logout(existingUser.id)

			throw new HTTPException(401, {
				message: 'Refresh token không chính xác, đã đăng ',
				res: new Response('Unauthorized', {
					headers: {
						statusCode: ErrorCode.UNAUTHORIZED_ERROR
					}
				})
			})
		}

		return {
			user: existingUser,
			level: decoded.level
		}
	} catch (error) {
		if (error instanceof JwtTokenExpired) {
			throw new HTTPException(409, {
				message: 'Refresh Token hết hạn',
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
