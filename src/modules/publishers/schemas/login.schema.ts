import { z } from 'zod'

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Vui lòng nhập email' })
		.email({ message: 'Email không đúng định dạng' }),
	password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' })
})

export type LoginSchema = z.infer<typeof loginSchema>
