import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { apiDocsConfig } from '@/configs/api-docs.config.js'
import { errorHandlerConfig } from '@/configs/error-handler.config.js'
import { swaggerConfig } from '@/configs/swgger.config.js'
import { env } from '@/lib/env.js'
import { apiKeyMiddleware } from '@/middlewares/api-key.middleware.js'
import { authRoutes } from '@/modules/auth/routes.js'
import { sendForgotPasswordWorker } from '@/workers/send-forgot-pasword.worker.js'
import { sendVerificationWorker } from '@/workers/send-verification.worker.js'

const app = new Hono().use(
	cors({
		origin: ['https://tuna-awaited-rat.ngrok-free.app'],
		credentials: true
	})
)

export const appRouter = app
	.basePath(env.API_PREFIX)
	.use(apiKeyMiddleware)
	.route('/auth', authRoutes)

app.get('/docs', apiDocsConfig(appRouter))

app.get('/api-docs', swaggerConfig)

app.onError(errorHandlerConfig)

sendVerificationWorker.on('completed', () =>
	console.log('Task done: Send verification mail')
)

sendForgotPasswordWorker.on('completed', () =>
	console.log('Task done: Send forgot password mail')
)

const port = parseInt(env.PORT)

console.log(`Server is running on ${env.DOMAIN}`)

serve({
	fetch: app.fetch,
	port
})
