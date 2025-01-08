import { generateResetPasswordToken } from '@/modules/token/services/reset-password-token/generate.service.js'
import { verifyResetPasswordToken } from '@/modules/token/services/reset-password-token/verify.service.js'

export const resetPasswordTokenService = {
	genetate: generateResetPasswordToken,
	verify: verifyResetPasswordToken
}
