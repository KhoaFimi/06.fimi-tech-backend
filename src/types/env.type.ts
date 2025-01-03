import type { JWTPayload } from 'hono/utils/jwt/types'

export interface AccessTokenPayload extends JWTPayload {
	sub: string
	level: string
}
