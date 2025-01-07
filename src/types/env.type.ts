import { Prisma } from '@prisma/client'
import type { JWTPayload } from 'hono/utils/jwt/types'

export type AuthPublisher = Prisma.PublisherGetPayload<{
	include: {
		platform: {
			select: {
				code: true
				id: true
			}
		}
	}
}>

export interface AccessTokenPayload extends JWTPayload {
	sub: string
	level: string
}
