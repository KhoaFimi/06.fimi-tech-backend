import { Worker } from 'bullmq'

import { sendMail } from '@/lib/mailer.js'
import { queueList } from '@/lib/queue.js'
import { redisConnection } from '@/lib/redis.js'
import { tokenService } from '@/modules/token/services/index.js'

export const sendVerificationWorker = new Worker(
	queueList.sendVerificationMailQueue,
	async job => {
		const verificationToken = await tokenService.verificationToken.generate(
			job.data.id
		)

		await sendMail({
			subject: 'OTP xác nhận tài khoản',
			text: `OTP: ${verificationToken.otp}`,
			from: `FIMI <no-reply@fimi.tech>`,
			to: job.data.email
		})
	},
	{ connection: redisConnection }
)
