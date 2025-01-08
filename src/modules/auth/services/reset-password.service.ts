import argon2 from 'argon2'

import { db } from '@/lib/db.js'
import { ResetPasswordSchema } from '@/modules/auth/schemas/reset-password.schema.js'
import { tokenService } from '@/modules/token/services/index.js'

export const resetPasswordService = async (values: ResetPasswordSchema) => {
	const { verificationKey, otp, password } = await values

	const res = await tokenService.resetPasswordToken.verify(otp, verificationKey)

	const hashedPassword = await argon2.hash(password)

	return await db.publisher.update({
		where: {
			id: res.identifier
		},
		data: {
			password: hashedPassword
		},
		omit: {
			password: true
		}
	})
}
