import { createFactory } from 'hono/factory'

import { AuthPublisher } from '@/types/env.type.js'

type Env = {
	Variables: {
		authPublisher: AuthPublisher
	}
}

export const hf = createFactory<Env>()
