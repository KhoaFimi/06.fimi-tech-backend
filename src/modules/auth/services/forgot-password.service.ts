import { HTTPException } from 'hono/http-exception'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'
import { sendForgotPasswordMailQueue } from '@/lib/queue.js'
import { ForgotPasswordSchema } from '@/modules/auth/schemas/forgot-password.schema.js'

export const forgotPasswordService = async (values: ForgotPasswordSchema) => {
	const existingUser = await db.publisher.findUnique({
		where: {
			email: values.email
		}
	})

	if (!existingUser)
		throw new HTTPException(404, {
			message: 'Email không chính xác',
			res: new Response('Not Found', {
				status: 404,
				headers: {
					statusCode: ErrorCode.WRONG_CREDENTIALS_ERROR
				}
			})
		})

	await sendForgotPasswordMailQueue.add(
		'send-forgot-password-mail',
		{
			id: existingUser.id,
			email: existingUser.email
		},
		{
			removeOnComplete: true
		}
	)

	return {
		verificationKey: existingUser.id
	}
}
