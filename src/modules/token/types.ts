import { JWTPayload } from 'hono/utils/jwt/types'

export interface IAccessTokenPayload extends JWTPayload {
	sub: string
	level: number
}

export interface IRefreshTokenPayload extends JWTPayload {
	sub: string
}
