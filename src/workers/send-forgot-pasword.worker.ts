import { Worker } from 'bullmq'

import { sendMail } from '@/lib/mailer.js'
import { queueList } from '@/lib/queue.js'
import { redisConnection } from '@/lib/redis.js'
import { tokenService } from '@/modules/token/services/index.js'

export const sendForgotPasswordWorker = new Worker(
	queueList.sendForgotPasswordMailQueue,
	async job => {
		const verificationToken = await tokenService.resetPasswordToken.generate(
			job.data.id
		)

		await sendMail({
			subject: 'OTP lấy lại mật khẩu',
			text: `OTP: ${verificationToken.otp}`,
			from: `FIMI <no-reply@fimi.tech>`,
			to: job.data.email
		})
	},
	{ connection: redisConnection }
)
