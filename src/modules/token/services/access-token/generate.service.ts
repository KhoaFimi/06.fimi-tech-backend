import { sign } from 'hono/jwt'

import { accessTokenPrivateKey } from '@/constraints/jwt.constraint.js'
import { env } from '@/lib/env.js'
import { IAccessTokenPayload } from '@/modules/token/types.js'

export const generateAccessTokenService = async (
	payload: IAccessTokenPayload
) => {
	const now = Math.floor(Date.now() / 1000)

	const accessToken = await sign(
		{
			...payload,
			iat: now,
			exp: Math.floor(Date.now() / 1000) + parseInt(env.ACCESS_TOKEN_EXPIRES)
		} satisfies IAccessTokenPayload,
		accessTokenPrivateKey,
		'RS256'
	)

	return {
		accessToken
	}
}
