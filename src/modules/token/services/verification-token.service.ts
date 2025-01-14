import argon2 from 'argon2'
import { HTTPException } from 'hono/http-exception'
import { generate as OTPGen } from 'otp-generator'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'

export const verificationToken = {
	generate: async (identifier: string) => {
		const exisitingToken = await db.verificationToken.findFirst({
			where: { identifier }
		})

		if (exisitingToken)
			await db.verificationToken.delete({ where: { id: exisitingToken.id } })

		const otp = OTPGen(6, {
			digits: true,
			lowerCaseAlphabets: false,
			upperCaseAlphabets: false,
			specialChars: false
		})

		const token = await argon2.hash(otp)

		const expires = new Date(new Date().getTime() + 3600 * 1000)

		await db.verificationToken.create({
			data: {
				token,
				identifier,
				expires
			}
		})

		return {
			otp
		}
	},
	verify: async (token: string, identifier: string) => {
		const existingToken = await db.verificationToken.findFirst({
			where: {
				identifier
			}
		})

		if (!existingToken)
			throw new HTTPException(404, {
				message: 'Verification key không chính xác',
				res: new Response('Not Found', {
					status: 404,
					statusText: ErrorCode.WRONG_CREDENTIALS_ERROR
				})
			})

		const hasExpired = new Date(existingToken.expires) < new Date()

		if (hasExpired) {
			await db.verificationToken.delete({
				where: {
					id: existingToken.id
				}
			})

			throw new HTTPException(400, {
				message: 'OTP đã hết hạn',
				res: new Response('Bad Request', {
					status: 400,
					statusText: ErrorCode.OTP_EXPIRES_ERROR
				})
			})
		}

		const verifyToken = await argon2.verify(existingToken.token, token)

		if (!verifyToken)
			throw new HTTPException(400, {
				message: 'OTP không chính xác',
				res: new Response('Bad request', {
					status: 400,
					statusText: ErrorCode.WRONG_CREDENTIALS_ERROR
				})
			})

		await db.verificationToken.delete({
			where: {
				id: existingToken.id
			}
		})

		return {
			identifier
		}
	}
}
