import { z } from 'zod'

export const resetPasswordSchema = z.object({
	verificationKey: z.string().min(1, { message: 'Yêu cầu Verification key' }),
	otp: z.string().min(1, { message: 'Vui lòng nhập OTP' }),
	password: z
		.string()
		.min(8, { message: 'Mật khẩu phải có tối thiểu 8 ký tự' })
		.max(64, { message: 'Mật khẩu không quá 64 ký tự' })
		.refine(password => /[A-Z]/.test(password), {
			message: 'Mật khẩu phải có tối thiểu 1 ký tự in hoa'
		})
		.refine(password => /[a-z]/.test(password), {
			message: 'Mật khẩu phải có tối thiểu 1 ký tự in thường'
		})
		.refine(password => /[0-9]/.test(password), {
			message: 'Mật khẩu phải có 1 chữ số'
		})
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
