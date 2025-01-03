import argon2 from 'argon2'
import { HTTPException } from 'hono/http-exception'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'
import { sendVerificationMailQueue } from '@/lib/queue.js'
import { SuccessResponse } from '@/lib/response.js'
import { LoginSchema } from '@/modules/publishers/schemas/login.schema.js'
import { tokenService } from '@/modules/token/services/index.js'

export const loginService = async (values: LoginSchema) => {
	const { email, password } = values

	const existingUser = await db.publisher.findUnique({
		where: {
			email: email
		}
	})

	if (!existingUser)
		throw new HTTPException(404, {
			message: 'Thông tin đăng nhập không chính xác',
			res: new Response('Not Found', {
				status: 404,
				headers: {
					statusCode: ErrorCode.WRONG_CREDENTIALS_ERROR
				}
			})
		})

	if (!existingUser.emailVerified) {
		await sendVerificationMailQueue.add(
			'send-verification-mail',
			{
				id: existingUser.id,
				email: existingUser.email
			},
			{
				removeOnComplete: true
			}
		)

		return new SuccessResponse(SuccessCode.NOT_VERIFIED, {
			verificationKey: existingUser.id
		})
	}

	const verifyPassword = await argon2.verify(existingUser.password, password)

	if (!verifyPassword)
		throw new HTTPException(404, {
			message: 'Thông tin đăng nhập không chính xác',
			res: new Response('Not Found', {
				status: 404,
				headers: {
					statusCode: ErrorCode.WRONG_CREDENTIALS_ERROR
				}
			})
		})

	const {
		data: { accessToken }
	} = await tokenService.accessToken.generate({
		sub: existingUser.id,
		level: existingUser.level
	})

	const {
		data: { refreshToken }
	} = await tokenService.refreshToken.generate(existingUser.id)

	return new SuccessResponse(SuccessCode.OK, {
		accessToken,
		refreshToken
	})
}
