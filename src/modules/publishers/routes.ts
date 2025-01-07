import { Hono } from 'hono'

import { publisherController } from '@/modules/publishers/controllers/index.js'

export const publisherRoutes = new Hono()
	.post('/register', ...publisherController.register)
	.post('/login', ...publisherController.login)
	.post('/new-verification', ...publisherController.newVerification)
	.get('/new-otp/:key', ...publisherController.getNewOtp)
	.get('/refresh-token', ...publisherController.refreshToken)
	.post('/forgot-password', ...publisherController.forgotPassword)
	.post('/reset-password', ...publisherController.resetPassword)
	.get('/', ...publisherController.getAllPublisherPagination)
