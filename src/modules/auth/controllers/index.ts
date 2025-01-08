import { forgotPasswordController } from '@/modules/auth/controllers/forgot-password.controller.js'
import { getNewOTPController } from '@/modules/auth/controllers/get-new-otp.controller.js'
import { loginController } from '@/modules/auth/controllers/login.controller.js'
import { logoutController } from '@/modules/auth/controllers/logout.controller.js'
import { newVerificationController } from '@/modules/auth/controllers/new-verification.controller.js'
import { refreshTokenController } from '@/modules/auth/controllers/refresh-token.controller.js'
import { registerController } from '@/modules/auth/controllers/register.controller.js'
import { resetPasswordController } from '@/modules/auth/controllers/reset-password.controller.js'

export const authController = {
	login: loginController,
	register: registerController,
	logout: logoutController,
	newVerification: newVerificationController,
	forgotPassword: forgotPasswordController,
	resetPassword: resetPasswordController,
	getNewOtp: getNewOTPController,
	refreshToken: refreshTokenController
}
