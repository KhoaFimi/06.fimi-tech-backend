import { forgotPasswordService } from '@/modules/publishers/services/forgot-password.service.js'
import { getAllPublisherService } from '@/modules/publishers/services/get-all-publisher.service.js'
import { getNewOtpService } from '@/modules/publishers/services/get-new-otp.service.js'
import { loginService } from '@/modules/publishers/services/login.service.js'
import { newVerificationService } from '@/modules/publishers/services/new-verification.service.js'
import { registerService } from '@/modules/publishers/services/register.service.js'
import { resetPasswordService } from '@/modules/publishers/services/reset-password.service.js'

export const publishersService = {
	register: registerService,
	login: loginService,
	newVerification: newVerificationService,
	getNewOtp: getNewOtpService,
	forgotPassword: forgotPasswordService,
	resetPassword: resetPasswordService,
	getAllPublisher: getAllPublisherService
}
