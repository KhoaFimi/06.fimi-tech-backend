import argon2 from 'argon2'
import { HTTPException } from 'hono/http-exception'

import { ErrorCode, SuccessCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'
import { sendVerificationMailQueue } from '@/lib/queue.js'
import { SuccessResponse } from '@/lib/response.js'
import { RegisterSchema } from '@/modules/publishers/schemas/register.schema.js'

export const registerService = async (registerSchema: RegisterSchema) => {
	const { fullname, email, password, phone, tnc, platformCode } = registerSchema

	if (!tnc)
		throw new HTTPException(400, {
			message: 'Vui lòng chấp nhận các điểu khoản sử dụng của chúng tôi !',
			res: new Response('Bad Request', {
				status: 400,
				headers: {
					statusCode: ErrorCode.NO_TNC_ERROR
				}
			})
		})

	if (!platformCode)
		throw new HTTPException(400, {
			message: 'Yêu cầu mã Partner ',
			res: new Response('Bad Request', {
				status: 400,
				headers: {
					statusCode: ErrorCode.MISSING_ERROR
				}
			})
		})

	const [existingUser, existingPlatform] = await db.$transaction([
		db.publisher.findFirst({ where: { OR: [{ email }, { phone }] } }),
		db.platform.findUnique({ where: { code: platformCode } })
	])

	if (existingUser)
		throw new HTTPException(409, {
			message: 'Người dùng đã tồn tại trong hệ thống',
			res: new Response('Conflict', {
				status: 409,
				headers: {
					statusCode: ErrorCode.DUPLICATED_ERROR
				}
			})
		})

	if (!existingPlatform)
		throw new HTTPException(404, {
			message: 'Mã partner không chính xác',
			res: new Response('Not Found', {
				status: 404,
				headers: {
					statusCode: ErrorCode.NOT_FOUND_ERROR
				}
			})
		})

	const hashedPassword = await argon2.hash(password)

	const newPublisher = await db.publisher.create({
		data: {
			fullname,
			email,
			phone,
			tnc,
			code: `${platformCode}${phone.substring(1)}`,
			password: hashedPassword,
			platformId: existingPlatform.id
		}
	})

	await sendVerificationMailQueue.add(
		'send-verification-mail',
		{
			id: newPublisher.id,
			email: newPublisher.email
		},
		{
			removeOnComplete: true
		}
	)

	return new SuccessResponse(SuccessCode.CREATED, {
		verificationKey: newPublisher.id
	})
}
