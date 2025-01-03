import { createFactory } from 'hono/factory'
import type { JwtVariables } from 'hono/jwt'

import { AccessTokenPayload } from '@/types/env.type'

type Env = {
	Variables: JwtVariables<AccessTokenPayload>
}

export const hf = createFactory<Env>()
