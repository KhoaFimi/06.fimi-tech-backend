import argon2 from 'argon2'

import { SuccessCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'
import { SuccessResponse } from '@/lib/response.js'
import { ResetPasswordSchema } from '@/modules/publishers/schemas/reset-password.schema.js'
import { tokenService } from '@/modules/token/services/index.js'

export const resetPasswordService = async (values: ResetPasswordSchema) => {
	const { verificationKey, otp, password } = await values

	const res = await tokenService.resetPasswordToken.verify(otp, verificationKey)

	const hashedPassword = await argon2.hash(password)

	await db.publisher.update({
		where: {
			id: res.identifier
		},
		data: {
			password: hashedPassword
		}
	})

	return new SuccessResponse(SuccessCode.OK)
}
