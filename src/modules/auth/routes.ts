import { Hono } from 'hono'

import { authController } from '@/modules/auth/controllers/index.js'

export const authRoutes = new Hono()
	.post('/register', ...authController.register)
	.post('/login', ...authController.login)
	.put('/logout/:id', ...authController.logout)
	.post('/new-verification', ...authController.newVerification)
	.post('/forgot-password', ...authController.forgotPassword)
	.post('/reset-password', ...authController.resetPassword)
	.get('/new-otp', ...authController.getNewOtp)
	.get('/refresh-token', ...authController.refreshToken)
	.get('/', ...authController.getAuth)
