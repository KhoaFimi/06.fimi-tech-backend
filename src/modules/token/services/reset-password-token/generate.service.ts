import argon2 from 'argon2'
import { generate as OTPGen } from 'otp-generator'

import { db } from '@/lib/db.js'

export const generateResetPasswordToken = async (identifier: string) => {
	const exisitingToken = await db.resetPasswordToken.findFirst({
		where: { identifier }
	})

	if (exisitingToken)
		await db.resetPasswordToken.delete({ where: { id: exisitingToken.id } })

	const otp = OTPGen(6, {
		digits: true,
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false
	})

	const token = await argon2.hash(otp)

	const expires = new Date(new Date().getTime() + 3600 * 1000)

	await db.resetPasswordToken.create({
		data: {
			token,
			identifier,
			expires
		}
	})

	return {
		otp
	}
}
