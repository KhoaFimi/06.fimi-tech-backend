import { accessToken } from '@/modules/token/services/access-token.service.js'
import { refreshToken } from '@/modules/token/services/refresh-token.service.js'
import { resetPasswordToken } from '@/modules/token/services/reset-password-token.service.js'
import { verificationToken } from '@/modules/token/services/verification-token.service.js'

export const tokenService = {
	verificationToken,
	resetPasswordToken,
	accessToken,
	refreshToken
}
