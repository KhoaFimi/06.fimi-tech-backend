import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { openAPISpecs } from 'hono-openapi'

import { env } from '@/lib/env.js'
import { apiKeyMiddleware } from '@/middlewares/api-key.middleware.js'
import { publisherRoutes } from '@/modules/publishers/routes.js'
import { sendForgotPasswordWorker } from '@/workers/send-forgot-pasword.worker.js'
import { sendVerificationWorker } from '@/workers/send-verification.worker.js'

const app = new Hono().use(
	cors({
		origin: ['https://tuna-awaited-rat.ngrok-free.app'],
		credentials: true
	})
)

const appRouter = app
	.basePath(env.API_PREFIX)
	.get('/health-check', c => c.text('All ok'))
	.use(apiKeyMiddleware)
	.route('/publishers', publisherRoutes)

app.get(
	'/docs',
	openAPISpecs(appRouter, {
		documentation: {
			info: {
				title: 'FIMI tech backend',
				version: '0.0.1',
				description: 'FIMI tech backend'
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT'
					},
					apiKey: {
						type: 'apiKey',
						in: 'header',
						name: 'X-API-KEY'
					},
					partnerCode: {
						type: 'apiKey',
						in: 'header',
						name: 'X-PARTNER-CODE'
					}
				}
			},
			servers: [{ url: 'http://localhost:8080', description: 'Local Server' }]
		}
	})
)

app.get(
	'/api-docs',
	swaggerUI({
		url: '/docs'
	})
)

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		const res = err.getResponse()

		const statusCode = res.headers.get('statusCode')

		return c.json(
			{
				statusCode,
				message: err.message
			},
			err.status
		)
	}
})

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
