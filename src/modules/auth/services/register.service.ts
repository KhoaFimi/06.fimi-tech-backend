import argon2 from 'argon2'
import { HTTPException } from 'hono/http-exception'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'
import { sendVerificationMailQueue } from '@/lib/queue.js'
import { RegisterSchema } from '@/modules/auth/schemas/register.schema.js'

export const registerService = async (
	registerSchema: RegisterSchema,
	partnerCode: string
) => {
	const { fullname, email, password, phone, tnc, ref } = registerSchema

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

	if (!partnerCode)
		throw new HTTPException(400, {
			message: 'Yêu cầu mã Partner ',
			res: new Response('Bad Request', {
				status: 400,
				headers: {
					statusCode: ErrorCode.MISSING_ERROR
				}
			})
		})

	const [existingPublisher, existingPlatform] = await db.$transaction([
		db.user.findFirst({ where: { OR: [{ email }, { phone }] } }),
		db.platform.findUnique({ where: { code: partnerCode } })
	])

	if (existingPublisher)
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

	let managerId: string | null = null

	if (ref) {
		const existingPublisher = await db.user.findUnique({
			where: {
				code: ref
			}
		})

		if (!existingPublisher)
			throw new HTTPException(404, {
				message: 'Không tìm thấy manager',
				res: new Response('Not Found', {
					headers: {
						statusCode: ErrorCode.NOT_FOUND_ERROR
					}
				})
			})

		if (existingPublisher.level < 1) {
			await db.user.update({
				where: {
					id: existingPublisher.id
				},
				data: {
					level: 1
				}
			})
		}

		managerId = existingPublisher.id
	}

	const newPublisher = await db.user.create({
		data: {
			fullname,
			email,
			phone,
			tnc,
			managerId,
			code: `${partnerCode}${phone.substring(1)}`,
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

	return {
		verificationKey: newPublisher.id
	}
}
