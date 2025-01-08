import { z } from 'zod'

export const newVerificationSchema = z.object({
	verificationKey: z.string().min(1, { message: 'Yêu cầu Verification key' }),
	otp: z.string().min(1, { message: 'Vui lòng nhập OTP' })
})

export type NewVerificationSchema = z.infer<typeof newVerificationSchema>
