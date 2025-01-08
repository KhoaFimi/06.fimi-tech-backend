import argon2 from 'argon2'
import { sign } from 'hono/jwt'

import { refreshTokenPrivateKey } from '@/constraints/jwt.constraint.js'
import { db } from '@/lib/db.js'
import { env } from '@/lib/env.js'
import { IRefreshTokenPayload } from '@/modules/token/types.js'

export const generateRefreshTokenService = async (userId: string) => {
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

		const hashedToken = await argon2.hash(signRefreshToken)

		const expires = new Date(
			new Date().getTime() + parseInt(env.REFRESH_TOKEN_EXPIRES) * 1000
		)

		await db.refreshToken.create({
			data: {
				identifierId: userId,
				token: hashedToken,
				expires
			}
		})

		return {
			refreshToken: signRefreshToken
		}
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

		const hashedToken = await argon2.hash(signRefreshToken)

		const expires = new Date(
			new Date().getTime() + parseInt(env.REFRESH_TOKEN_EXPIRES) * 1000
		)

		await db.refreshToken.update({
			where: {
				id: existingToken.id
			},
			data: {
				token: hashedToken,
				expires
			}
		})

		return {
			refreshToken: signRefreshToken
		}
	}
}
