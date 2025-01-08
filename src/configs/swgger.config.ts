import { swaggerUI } from '@hono/swagger-ui'

export const swaggerConfig = swaggerUI({
	url: '/docs'
})
