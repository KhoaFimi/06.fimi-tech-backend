import { forgotPasswordController } from '@/modules/publishers/controllers/forgot-password.controller.js'
import { getNewOtpController } from '@/modules/publishers/controllers/get-new-otp.controller.js'
import { loginController } from '@/modules/publishers/controllers/login.controller.js'
import { newVerificationController } from '@/modules/publishers/controllers/new-verification.controller.js'
import { refreshTokenController } from '@/modules/publishers/controllers/refresh-token.controller.js'
import { registerController } from '@/modules/publishers/controllers/register.controller.js'
import { resetPasswordController } from '@/modules/publishers/controllers/reset-password.controller.js'

export const publisherController = {
	register: registerController,
	login: loginController,
	newVerification: newVerificationController,
	getNewOtp: getNewOtpController,
	refreshToken: refreshTokenController,
	forgotPassword: forgotPasswordController,
	resetPassword: resetPasswordController
}
