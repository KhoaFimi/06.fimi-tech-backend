import argon2 from 'argon2'
import { generate as OTPGen } from 'otp-generator'

import { db } from '@/lib/db.js'

export const generateVerificationToken = async (identifier: string) => {
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

	const expires = new Date(new Date().getTime() + 600 * 1000)

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
}
