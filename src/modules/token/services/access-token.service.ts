import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import { JWTPayload, JwtTokenExpired } from 'hono/utils/jwt/types'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import {
	accessTokenPrivateKey,
	accessTokenPublicKey
} from '@/constraints/jwt.constraint.js'
import { db } from '@/lib/db.js'
import { env } from '@/lib/env.js'
import { SuccessResponse } from '@/lib/response.js'

export interface IAccessTokenPayload extends JWTPayload {
	sub: string
	level: number
}

export const accessToken = {
	generate: async (payload: IAccessTokenPayload) => {
		const now = Math.floor(Date.now() / 1000)

		const accessToken = await sign(
			{
				...payload,
				iat: now,
				exp: Math.floor(Date.now() / 1000) + parseInt(env.ACCESS_TOKEN_EXPIRES)
			} satisfies IAccessTokenPayload,
			accessTokenPrivateKey,
			'RS256'
		)

		return new SuccessResponse(SuccessCode.OK, {
			accessToken
		})
	},
	verify: async (token: string) => {
		try {
			const decoded = (await verify(
				token,
				accessTokenPublicKey,
				'RS256'
			)) as IAccessTokenPayload

			const existingUser = await db.publisher.findUnique({
				where: { id: decoded.sub }
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

			return new SuccessResponse(SuccessCode.OK, {
				user: existingUser,
				level: existingUser.level
			})
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
}
