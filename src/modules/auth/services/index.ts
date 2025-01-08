import { forgotPasswordService } from '@/modules/auth/services/forgot-password.service.js'
import { getNewOtpService } from '@/modules/auth/services/get-new-otp.service.js'
import { loginService } from '@/modules/auth/services/login.service.js'
import { logoutService } from '@/modules/auth/services/logout.service.js'
import { newVerificationService } from '@/modules/auth/services/new-verification.service.js'
import { registerService } from '@/modules/auth/services/register.service.js'
import { resetPasswordService } from '@/modules/auth/services/reset-password.service.js'

export const authService = {
	login: loginService,
	register: registerService,
	logout: logoutService,
	newVerification: newVerificationService,
	forgotPassword: forgotPasswordService,
	resetPassword: resetPasswordService,
	getNewOtp: getNewOtpService
}
