import argon2 from 'argon2'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { refreshTokenPublicKey } from '@/constraints/jwt.constraint.js'
import { db } from '@/lib/db.js'
import { authService } from '@/modules/auth/services/index.js'
import { tokenService } from '@/modules/token/services/index.js'
import { IRefreshTokenPayload } from '@/modules/token/types.js'

export const refreshTokenPairService = async (token: string) => {
	const decodedToken = (await verify(
		token,
		refreshTokenPublicKey,
		'RS256'
	)) as IRefreshTokenPayload

	const existingToken = await db.refreshToken.findUnique({
		where: { identifierId: decodedToken.sub },
		include: {
			user: {
				select: {
					id: true,
					level: true
				}
			}
		}
	})

	if (!existingToken)
		throw new HTTPException(400, {
			message: 'Refresh token không chính xác',
			res: new Response('Bad Request', {
				status: 400,
				headers: {
					statusCode: ErrorCode.WRONG_CREDENTIALS_ERROR
				}
			})
		})

	const hasExpires = new Date(existingToken.expires) < new Date()

	if (hasExpires) {
		await authService.logout(existingToken.identifierId)

		throw new HTTPException(400, {
			message: 'Refresh token hết hạn',
			res: new Response('Bad Request', {
				status: 400,
				statusText: ErrorCode.UNAUTHORIZED_ERROR
			})
		})
	}

	const verifyToken = await argon2.verify(existingToken.token, token)

	if (!verifyToken)
		throw new HTTPException(400, {
			message: 'Refresh token không chính xác',
			res: new Response('Bad Request', {
				status: 400,
				statusText: ErrorCode.UNAUTHORIZED_ERROR
			})
		})

	const { accessToken } = await tokenService.accessToken.generate({
		sub: existingToken.user.id,
		level: existingToken.user.level
	})

	return {
		accessToken,
		refreshToken: token
	}
}
