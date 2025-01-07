import { HTTPException } from 'hono/http-exception'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { hf } from '@/lib/factory.js'
import { validationError } from '@/lib/validation-error.js'
import { accessMiddleware } from '@/middlewares/access.middleware.js'
import { getAllPublisherSchema } from '@/modules/publishers/schemas/get-all-publisher.schema.js'
import { publishersService } from '@/modules/publishers/services/index.js'

export const getAllPublisherPaginationController = hf.createHandlers(
	describeRoute({
		tags: ['Publishers'],
		description:
			'Truy vấn toàn bộ publisher trên hệ thống. Yêu cầu level 1 trở lên',
		security: [
			{
				apiKey: [],
				partnerCode: [],
				bearerAuth: []
			}
		]
	}),
	accessMiddleware(1),
	validator('query', getAllPublisherSchema, res => {
		if (res.success === false) {
			throw new HTTPException(400, {
				message: validationError(res.error),
				res: new Response('Bad Request', {
					status: 400,
					headers: {
						statusCode: ErrorCode.VAL_ERROR
					}
				})
			})
		}
	}),
	async c => {
		const { page, limit, type } = c.req.valid('query')

		const authPub = c.get('authPublisher')

		if (type === 'platform-owner' && authPub.level >= 2) {
			const res = await publishersService.getAllPublisher({
				page,
				limit,
				where: {
					platform: {
						code: authPub.platform.code
					}
				}
			})

			return c.json({
				...res,
				message: 'Truy vấn publisher thành công'
			})
		}

		if (type === 'manager' && authPub.level >= 1) {
			const res = await publishersService.getAllPublisher({
				page,
				limit,
				where: {
					managerId: authPub.id
				}
			})

			return c.json({
				...res,
				message: 'Truy vấn publisher thành công'
			})
		}

		throw new HTTPException(401, {
			message: 'Không đủ thẩm quyền thực hiện hành động này',
			res: new Response('Unauthorized', {
				headers: {
					statusCode: ErrorCode.UNAUTHORIZED_ERROR
				}
			})
		})
	}
)
