import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import { JWTPayload } from 'hono/utils/jwt/types'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import {
	refreshTokenPrivateKey,
	refreshTokenPublicKey
} from '@/constraints/jwt.constraint.js'
import { db } from '@/lib/db.js'
import { env } from '@/lib/env.js'
import { SuccessResponse } from '@/lib/response.js'
import { tokenService } from '@/modules/token/services/index.js'

export interface IRefreshTokenPayload extends JWTPayload {
	sub: string
}

export const refreshToken = {
	generate: async (userId: string) => {
		const existingToken = await db.refreshToken.findUnique({
			where: { identifierId: userId }
		})

		if (!existingToken) {
			const signRefreshToken = await sign(
				{
					sub: userId
				} satisfies IRefreshTokenPayload,
				refreshTokenPrivateKey,
				'RS256'
			)

			const expires = new Date(
				new Date().getTime() + parseInt(env.REFRESH_TOKEN_EXPIRES) * 1000
			)

			const newRefreshToken = await db.refreshToken.create({
				data: {
					identifierId: userId,
					token: signRefreshToken,
					expires
				}
			})

			return new SuccessResponse(SuccessCode.OK, {
				refreshToken: newRefreshToken.token
			})
		}

		const hasExpires = new Date(existingToken.expires) < new Date()

		if (!hasExpires) {
			const signRefreshToken = await sign(
				{
					sub: userId
				} satisfies IRefreshTokenPayload,
				refreshTokenPrivateKey,
				'RS256'
			)

			const expires = new Date(
				new Date().getTime() + parseInt(env.REFRESH_TOKEN_EXPIRES) * 1000
			)

			const updatedToken = await db.refreshToken.update({
				where: {
					id: existingToken.id
				},
				data: {
					token: signRefreshToken,
					expires
				}
			})

			return new SuccessResponse(SuccessCode.OK, {
				refreshToken: updatedToken.token
			})
		}

		return new SuccessResponse(SuccessCode.OK, {
			refreshToken: existingToken.token
		})
	},
	refresh: async (token: string) => {
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
			throw new HTTPException(400, {
				message: 'OTP đã hết hạn',
				res: new Response('Bad Request', {
					status: 400,
					statusText: ErrorCode.OTP_EXPIRES_ERROR
				})
			})
		}

		const {
			data: { accessToken }
		} = await tokenService.accessToken.generate({
			sub: existingToken.user.id,
			level: existingToken.user.level
		})

		const currentRefreshToken = existingToken.token

		return new SuccessResponse(SuccessCode.OK, {
			accessToken,
			refreshToken: currentRefreshToken
		})
	}
}
