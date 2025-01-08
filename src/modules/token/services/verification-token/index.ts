import { generateVerificationToken } from '@/modules/token/services/verification-token/generate.service.js'
import { verifyVeificationToken } from '@/modules/token/services/verification-token/verify.service.js'

export const verificationTokenService = {
	generate: generateVerificationToken,
	verify: verifyVeificationToken
}
