import { Hono } from 'hono'

import { publisherController } from '@/modules/publishers/controllers/index.js'

export const publisherRoutes = new Hono()
	.get('/new-otp/:key', ...publisherController.getNewOtp)
	.get('/refresh-token', ...publisherController.refreshToken)
	.get('/', ...publisherController.getAllPublisher)
