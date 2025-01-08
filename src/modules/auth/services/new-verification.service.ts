import { db } from '@/lib/db.js'
import { NewVerificationSchema } from '@/modules/auth/schemas/new-verification.schema.js'
import { tokenService } from '@/modules/token/services/index.js'

export const newVerificationService = async (values: NewVerificationSchema) => {
	const { verificationKey, otp } = await values

	const res = await tokenService.verificationToken.verify(otp, verificationKey)

	await db.publisher.update({
		where: {
			id: res.identifier
		},
		data: {
			emailVerified: new Date()
		}
	})

	return true
}
