import argon2 from 'argon2'
import { HTTPException } from 'hono/http-exception'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'
import { hf } from '@/lib/factory.js'

export const apiKeyMiddleware = hf.createMiddleware(async (c, next) => {
	const apiKey = c.req.header('X-API-KEY')
	const partnerCode = c.req.header('X-PARTNER-CODE')

	if (!apiKey || !partnerCode)
		throw new HTTPException(401, {
			message: 'Thiếu API key hoặc Partner code',
			res: new Response('Not Found', {
				status: 401,
				headers: {
					statusCode: ErrorCode.UNAUTHORIZED_ERROR
				}
			})
		})

	const existingPlatform = await db.platform.findUnique({
		where: { code: partnerCode }
	})

	if (!existingPlatform)
		throw new HTTPException(401, {
			message: 'Thiếu API key hoặc Partner code',
			res: new Response('Not Found', {
				status: 401,
				headers: {
					statusCode: ErrorCode.UNAUTHORIZED_ERROR
				}
			})
		})

	const verifyApiKey = await argon2.verify(existingPlatform.apiKey, apiKey)

	if (!verifyApiKey)
		throw new HTTPException(401, {
			message: 'Thiếu API key hoặc Partner code',
			res: new Response('Not Found', {
				status: 401,
				headers: {
					statusCode: ErrorCode.UNAUTHORIZED_ERROR
				}
			})
		})

	c.set('partnerCode', partnerCode)

	await next()
})
