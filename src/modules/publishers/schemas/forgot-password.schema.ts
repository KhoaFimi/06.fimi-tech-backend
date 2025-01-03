import { z } from 'zod'

export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Vui lòng nhập Email' })
		.email({ message: 'Email không đúng định dạng' })
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
