import { Queue } from 'bullmq'

import { redisConnection } from '@/lib/redis.js'

export const queueList = {
	sendVerificationMailQueue: 'send-verification-mail-queue',
	sendForgotPasswordMailQueue: 'send-forgot-password-mail-queue'
}

export const sendVerificationMailQueue = new Queue(
	queueList.sendVerificationMailQueue,
	{
		connection: redisConnection
	}
)

export const sendForgotPasswordMailQueue = new Queue(
	queueList.sendForgotPasswordMailQueue,
	{
		connection: redisConnection
	}
)
