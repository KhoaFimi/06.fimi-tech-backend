import { HTTPException } from 'hono/http-exception'

import { SuccessCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'
import { sendVerificationMailQueue } from '@/lib/queue.js'
import { SuccessResponse } from '@/lib/response.js'

export const getNewOtpService = async (verificationKey: string) => {
	const existingUser = await db.publisher.findUnique({
		where: { id: verificationKey }
	})

	if (!existingUser)
		throw new HTTPException(404, {
			message: 'Verification key không chính xác'
		})

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

	return new SuccessResponse(SuccessCode.OK, {
		verificationKey: existingUser.id
	})
}
