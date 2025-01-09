import { HTTPException } from 'hono/http-exception'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'

export const logoutService = async (id: string) => {
	const [existingPublisher, existingRefreshToken] = await db.$transaction([
		db.user.findUnique({ where: { id } }),
		db.refreshToken.findUnique({ where: { identifierId: id } })
	])

	if (!existingPublisher || !existingRefreshToken)
		throw new HTTPException(404, {
			message: 'Id không chính xác',
			res: new Response('Not Found', {
				headers: {
					statusCode: ErrorCode.NOT_FOUND_ERROR
				}
			})
		})

	await db.refreshToken.delete({
		where: {
			id: existingRefreshToken.id
		}
	})

	return true
}
