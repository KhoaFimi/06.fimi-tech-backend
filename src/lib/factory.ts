import { createFactory } from 'hono/factory'

type Env = {
	Variables: {
		authUserId: string
		partnerCode: string
	}
}

export const hf = createFactory<Env>()
