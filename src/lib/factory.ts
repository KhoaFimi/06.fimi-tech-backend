import { createFactory } from 'hono/factory'
import type { JwtVariables } from 'hono/jwt'

import { AccessTokenPayload, AuthPublisher } from '@/types/env.type.js'

type Env = {
	Variables: {
		jwtPayload: JwtVariables<AccessTokenPayload>
		authPublisher: AuthPublisher
	}
}

export const hf = createFactory<Env>()
