import Redis from 'ioredis'

import { env } from '@/lib/env.js'

export const redisConnection = new Redis.default({
	host: env.REDIS_HOST,
	port: parseInt(env.REDIS_PORT),
	maxRetriesPerRequest: null
})
