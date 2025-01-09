import { HTTPException } from 'hono/http-exception'

import { ErrorCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'

export const meService = async (id: string) => {
	const existingUser = await db.user.findUnique({
		where: { id },
		omit: { password: true, tnc: true },
		include: {
			platform: {
				select: { id: true, code: true }
			},
			manager: {
				omit: { password: true, tnc: true }
			},
			manage: {
				omit: { password: true, tnc: true }
			}
		}
	})

	if (!existingUser)
		throw new HTTPException(404, {
			message: 'Không tìm thấy người dùng',
			res: new Response('Not Found', {
				headers: {
					statusCode: ErrorCode.NOT_FOUND_ERROR
				}
			})
		})

	return {
		user: existingUser
	}
}
