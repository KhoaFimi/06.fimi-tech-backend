import { z } from 'zod'

export const registerSchema = z.object({
	fullname: z.string().min(1, { message: 'Vui lòng nhập họ và tên' }),
	email: z
		.string()
		.min(1, { message: 'Vui lòng nhập Email' })
		.email({ message: 'Email không đúng định dạng' }),
	phone: z
		.string()
		.min(1, { message: 'Vui lòng nhập số điện thoại' })
		.max(10, { message: 'Số điện thoại chỉ có 10 chữ số' })
		.refine(phone => /^\d+$/.test(phone), {
			message: 'Số điện thoại không đúng định dạng'
		}),
	ref: z.string().optional().nullish(),
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
		}),
	tnc: z.boolean().default(false),
	platformCode: z.string()
})

export type RegisterSchema = z.infer<typeof registerSchema>
