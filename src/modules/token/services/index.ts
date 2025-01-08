import { accessTokenService } from '@/modules/token/services/access-token/index.js'
import { refreshTokenService } from '@/modules/token/services/refresh-token/index.js'
import { resetPasswordTokenService } from '@/modules/token/services/reset-password-token/index.js'
import { verificationTokenService } from '@/modules/token/services/verification-token/index.js'

export const tokenService = {
	verificationToken: verificationTokenService,
	resetPasswordToken: resetPasswordTokenService,
	accessToken: accessTokenService,
	refreshToken: refreshTokenService
}
